import { _decorator } from 'cc';
import { IEnitity } from '../../levels';
import { EntityManager } from '../../base/EnitityManager';
import { PlayerStateMachine } from './PlayerStateMachine';
import { CONTROLLER_ENUM, DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM, SHAKE_TYPE_ENUM } from '../../enums';
import EventManager from '../../runtime/EventManager';
import DataManager from '../../runtime/DataManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
    targetX: number
    targetY: number
    isMoving: boolean = false
    isFloatMoving: boolean = false

    private readonly speed = 1/10
    fsm: PlayerStateMachine

    async init(params: IEnitity){
        this.fsm = this.addComponent(PlayerStateMachine)
        await this.fsm.init()
        super.init(params)
        this.targetX = this.x
        this.targetY = this.y
        //await this.render()
        EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
        EventManager.Instance.on(EVENT_ENUM.FLOAT_IDLE, this.floatIdleHandle, this)

    }

    onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.inputHandle)
        EventManager.Instance.off(EVENT_ENUM.FLOAT_IDLE, this.floatIdleHandle)
        
    }

    floatIdleHandle(){
        this.isFloatMoving = false
    }
    update(){
        this.updateXY()
        super.update()
    }

    updateXY(){
        if(this.targetX < this.x) {
            this.x -= this.speed
        }else if(this.targetX > this.x) {
            this.x += this.speed
        }

        if(this.targetY < this.y) {
            this.y -= this.speed
        }else if(this.targetY > this.y) {
            this.y += this.speed
        }

        if(Math.abs(this.targetX - this.x) < 0.1 && Math.abs(this.targetY - this.y) < 0.1 && this.isMoving) {
            this.isMoving = false
            this.x = this.targetX
            this.y = this.targetY
            EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)

            const floatTile = DataManager.Instance.floatTile
            for(let i = 0; i < floatTile.length; i++) {
                const float = floatTile[i]
                const switchs = DataManager.Instance.switchs[i]
                if(this.x === switchs.x && this.y === switchs.y) {
                    EventManager.Instance.emit(EVENT_ENUM.LIGHT_SWITCH, float.id)
                }else {
                    EventManager.Instance.emit(EVENT_ENUM.IDLE_SWITCH, float.id)
                }
            }

            const portalTile = DataManager.Instance.portal
            for(let i = 0; i < portalTile.length; i++) {
                const nextIndex = (i + 1) % DataManager.Instance.portal.length
                const portal = portalTile[nextIndex]
                if(this.x === portalTile[i].x && this.y === portalTile[i].y) {
                    EventManager.Instance.emit(EVENT_ENUM.TRANSFER_LIGHT, portal.id)
                }else {
                    EventManager.Instance.emit(EVENT_ENUM.TRANSFER_IDLE, portal.id)
                }
            }
        }
    }

    inputHandle(inputDirection: CONTROLLER_ENUM){
        if(this.isMoving || this.isFloatMoving) return
        
        if(inputDirection === CONTROLLER_ENUM.UNDO){
            EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
            return
        } else if(inputDirection === CONTROLLER_ENUM.MOVE) {
            const id = this.willMoveFloat(inputDirection)
            if(id !== null){
                EventManager.Instance.emit(EVENT_ENUM.FLOAT_MOVE, id)
            }
            
            const idx = this.willTransfer(inputDirection)
            if(idx !== null){
                EventManager.Instance.emit(EVENT_ENUM.TRANSFER, idx)
            }

            return
        } else if(inputDirection === CONTROLLER_ENUM.TOP || inputDirection === CONTROLLER_ENUM.BOTTOM || inputDirection === CONTROLLER_ENUM.LEFT || inputDirection === CONTROLLER_ENUM.RIGHT) {
            if(this.willBlock(inputDirection)) {
                switch(inputDirection){
                    case CONTROLLER_ENUM.TOP:
                        EventManager.Instance.emit(EVENT_ENUM.SHAKE, SHAKE_TYPE_ENUM.TOP)
                        break
                    case CONTROLLER_ENUM.BOTTOM:
                        EventManager.Instance.emit(EVENT_ENUM.SHAKE, SHAKE_TYPE_ENUM.BOTTOM)
                        break
                    case CONTROLLER_ENUM.LEFT:
                        EventManager.Instance.emit(EVENT_ENUM.SHAKE, SHAKE_TYPE_ENUM.LEFT)
                        break
                    case CONTROLLER_ENUM.RIGHT:
                        EventManager.Instance.emit(EVENT_ENUM.SHAKE, SHAKE_TYPE_ENUM.RIGHT)
                        break
                    default:
                        break
                }
                return
            }
            const id = this.willAttack(inputDirection)
            if(id){
                this.state = ENTITY_STATE_ENUM.ATTACK
                EventManager.Instance.emit(EVENT_ENUM.ATTACK_ENEMY, id)
                return
            }
            this.move(inputDirection)
        }
    }

    move(inputDirection: CONTROLLER_ENUM) {
        EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP)

        if(inputDirection === CONTROLLER_ENUM.TOP){
            this.state = ENTITY_STATE_ENUM.WALKTOP
            this.direction = DIRECTION_ENUM.TOP
            this.targetY -= 1
            this.isMoving = true
        } else if(inputDirection === CONTROLLER_ENUM.BOTTOM) {
            this.state = ENTITY_STATE_ENUM.WALKBOTTOM
            this.direction = DIRECTION_ENUM.BOTTOM
            this.targetY += 1
            this.isMoving = true
        } else if(inputDirection === CONTROLLER_ENUM.LEFT) {
            this.state = ENTITY_STATE_ENUM.WALKLEFT
            this.direction = DIRECTION_ENUM.LEFT
            this.targetX -= 1
            this.isMoving = true
        }else if(inputDirection === CONTROLLER_ENUM.RIGHT) {
            this.state = ENTITY_STATE_ENUM.WALKRIGHT
            this.direction = DIRECTION_ENUM.RIGHT
            this.targetX += 1
            this.isMoving = true
        }

    }

    willMoveFloat(inputDirection: CONTROLLER_ENUM){
        if(inputDirection === CONTROLLER_ENUM.MOVE){
            const floatTile = DataManager.Instance.floatTile
            for(let i = 0; i < floatTile.length; i++) {
                const float = floatTile[i]
                const switchs = DataManager.Instance.switchs[i]
                if(this.x === switchs.x && this.y === switchs.y) {
                    this.isFloatMoving = true
                    EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP)
                    return float.id
                }
            }
        }
        return ''
    }

    willTransfer(inputDirection: CONTROLLER_ENUM){
        for(let i = 0; i < DataManager.Instance.portal.length; i++){
            const portal = DataManager.Instance.portal[i]
            const jumpX = portal.x
            const jumpY = portal.y
            if(inputDirection === CONTROLLER_ENUM.MOVE && 
                this.x === jumpX && 
                this.y === jumpY)
            {
                EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP)
                EventManager.Instance.emit(EVENT_ENUM.PLAYER_MOVE_END)
                const nextIndex = (i + 1) % DataManager.Instance.portal.length
                this.targetX = this.x = DataManager.Instance.portal[nextIndex].x
                this.targetY = this.y = DataManager.Instance.portal[nextIndex].y
                this.state = ENTITY_STATE_ENUM.TRANSFER_PLAYER
                this.direction = DIRECTION_ENUM.BOTTOM
                return portal.id
            }
        }
        return ''
    }

    willBlock(inputDirection: CONTROLLER_ENUM){
        const { targetX: x, targetY: y} = this
        const {tileInfo} = DataManager.Instance

        if(inputDirection === CONTROLLER_ENUM.TOP) {
            const nextTile = tileInfo[x][y - 1]
            if( nextTile && nextTile.moveable ){
                return false
            }else{
                return true
            }
        } else if(inputDirection === CONTROLLER_ENUM.BOTTOM) {
            const nextTile = tileInfo[x][y + 1]
            if( nextTile && nextTile.moveable ){
                return false
            }else{
                return true
            }
        } else if(inputDirection === CONTROLLER_ENUM.LEFT) {
            const nextTile = tileInfo[x - 1][y]
            if( nextTile && nextTile.moveable ){
                return false
            }else{
                return true
            }
        } else if(inputDirection === CONTROLLER_ENUM.RIGHT) {
            const nextTile = tileInfo[x + 1][y]
            if( nextTile && nextTile.moveable ){
                return false
            }else{
                return true
            }
        }

        return false
    }

    willAttack(inputDirection: CONTROLLER_ENUM){
        const enemies = DataManager.Instance.enemies.filter(enemy => enemy.state !== ENTITY_STATE_ENUM.DEATH)
        for(let i = 0;i<enemies.length;i++){
            const enemy = enemies[i]
            if(inputDirection === CONTROLLER_ENUM.TOP
                && enemy.x === this.x
                && enemy.y === this.y - 1
            ){
                EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP)
                this.direction = DIRECTION_ENUM.TOP
                this.state = ENTITY_STATE_ENUM.ATTACK
                return enemy.id
            }else if(inputDirection === CONTROLLER_ENUM.BOTTOM
                && enemy.x === this.x
                && enemy.y === this.y + 1
            ){
                EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP)
                this.direction = DIRECTION_ENUM.BOTTOM
                this.state = ENTITY_STATE_ENUM.ATTACK
                return enemy.id
            }else if(inputDirection === CONTROLLER_ENUM.LEFT
                && enemy.x === this.x - 1
                && enemy.y === this.y
            ){
                EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP)
                this.direction = DIRECTION_ENUM.LEFT
                this.state = ENTITY_STATE_ENUM.ATTACK
                return enemy.id
            }else if(inputDirection === CONTROLLER_ENUM.RIGHT
                && enemy.x === this.x + 1
                && enemy.y === this.y
            ){
                EventManager.Instance.emit(EVENT_ENUM.RECORD_STEP)
                this.direction = DIRECTION_ENUM.RIGHT
                this.state = ENTITY_STATE_ENUM.ATTACK
                return enemy.id
            }
        }
        return ''
    }

    onAttackShake(type: SHAKE_TYPE_ENUM){
        console.log('onAttackShake called')
        EventManager.Instance.emit(EVENT_ENUM.SHAKE, type)
    }

    // async render(){
        // const sprite = this.addComponent(Sprite) // 自定义大小模式
        // sprite.sizeMode = Sprite.SizeMode.CUSTOM // 设置自定义大小
        // const transform = this.getComponent(UITransform)
        // transform.setContentSize(TILE_WIDTH * 1.5, TILE_HEIGHT * 1.5)

    //     const spriteFrames = await ResourceManager.Instance.loadDir("texture/player/idle/right/")
        
    //     const animationComponent = this.addComponent(Animation)

    //     const animationClip = new AnimationClip()
    //     animationClip.duration = 1.0 //动画周期

    //     const track = new animation.ObjectTrack() //对象轨道
    //     track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame') //指定轨道路径
    //     const filteredFrames = spriteFrames.filter(item => item.name.includes('('))
    //     const frames: Array<[number, SpriteFrame]> = filteredFrames.map((item,index) => [ANIMATION_SPEED * index, item])
    //     track.channel.curve.assignSorted(frames) // 关键帧排序

    //     animationClip.addTrack(track) // 轨道添加到动画剪辑

    //     animationClip.duration = frames.length * ANIMATION_SPEED //动画周期
    //     animationClip.wrapMode = AnimationClip.WrapMode.Loop // 循环播放
    //     animationComponent.defaultClip = animationClip
    //     animationComponent.play()
    // }

}
