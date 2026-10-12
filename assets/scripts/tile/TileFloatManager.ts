import { _decorator, UITransform, Animation } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM, PARAME_NAME_ENUM } from '../../enums';
import EventManager from '../../runtime/EventManager';
import { FloatStateMachine } from './FloatStateMachine';
import { EntityManager } from '../../base/EnitityManager';
import { IEnitity } from '../../levels';
import DataManager from '../../runtime/DataManager';
const { ccclass, property } = _decorator;

@ccclass('TileFloatManager')
export class TileFloatManager extends EntityManager {

    fsm: FloatStateMachine

    async init(params: IEnitity){
        this.id = this.randId()
        this.fsm = this.addComponent(FloatStateMachine)
        await this.fsm.init()
        super.init(params)
        const transform = this.getComponent(UITransform)
        if (this.direction === DIRECTION_ENUM.LEFT || this.direction === DIRECTION_ENUM.RIGHT){
            transform.setContentSize(TILE_WIDTH * 2, TILE_HEIGHT)
        } else if (this.direction === DIRECTION_ENUM.TOP || this.direction === DIRECTION_ENUM.BOTTOM){
            transform.setContentSize(TILE_WIDTH, TILE_HEIGHT * 2)
        }

        EventManager.Instance.on(EVENT_ENUM.FLOAT_MOVE, this.floatMove, this)
        EventManager.Instance.on(EVENT_ENUM.FLOAT_MOVE, this.initAnimationEvent, this)
        EventManager.Instance.on(EVENT_ENUM.LIGHT_SWITCH, this.lightSwitch, this)
        EventManager.Instance.on(EVENT_ENUM.IDLE_SWITCH, this.idleSwitch, this)
    }

    onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.FLOAT_MOVE, this.floatMove)
        EventManager.Instance.off(EVENT_ENUM.FLOAT_MOVE, this.initAnimationEvent)
        EventManager.Instance.off(EVENT_ENUM.LIGHT_SWITCH, this.lightSwitch)
        EventManager.Instance.off(EVENT_ENUM.IDLE_SWITCH, this.idleSwitch)
    }

    update(){
        this.node.setPosition(this.x * TILE_WIDTH, - this.y * TILE_HEIGHT)
        this.changeTile()
    }

    floatMove(id: string){
        if(id === this.id) {
            this.state = ENTITY_STATE_ENUM.MOVE
        }
        return
    }

    lightSwitch(idx: string){
        if(idx === this.id) {
            this.state = ENTITY_STATE_ENUM.LIGHT_SWITCH
        }
        return
    }

    idleSwitch(idx: string){
        if(idx === this.id) {
            this.state = ENTITY_STATE_ENUM.IDLE
        }
        return
    }

    changeTile(){
        const {tileInfo} = DataManager.Instance
        const {x, y} = this
        // 防御：tileInfo 还在异步加载中（TileMapManager.init 没跑完），下一帧再试
        if(!tileInfo?.[x]?.[y] || !tileInfo?.[x]?.[y+1] || !tileInfo?.[x+1]?.[y]) return
        if(this.type === ENTITY_TYPE_ENUM.FLOAT_BOTTOM ) {
            if(this.direction === DIRECTION_ENUM.BOTTOM){//底部浮台初始状态
                tileInfo[x][y].moveable = true
                tileInfo[x][y+1].moveable = false
            }else if(this.direction === DIRECTION_ENUM.TOP){//顶部浮台改变状态
                tileInfo[x][y].moveable = false
                tileInfo[x][y+1].moveable = true
            }
        }else if(this.type === ENTITY_TYPE_ENUM.FLOAT_TOP) {
            if(this.direction === DIRECTION_ENUM.TOP){//顶部浮台初始状态
                tileInfo[x][y].moveable = false
                tileInfo[x][y+1].moveable = true
            }else if(this.direction === DIRECTION_ENUM.BOTTOM){//底部浮台改变状态
                tileInfo[x][y].moveable = true
                tileInfo[x][y+1].moveable = false
            }
        }else if(this.type === ENTITY_TYPE_ENUM.FLOAT_LEFT) {
            if(this.direction === DIRECTION_ENUM.LEFT){//左侧浮台初始状态
                tileInfo[x][y].moveable = false
                tileInfo[x+1][y].moveable = true
            }else if(this.direction === DIRECTION_ENUM.RIGHT){//右侧浮台改变状态
                tileInfo[x][y].moveable = true
                tileInfo[x+1][y].moveable = false
            }
        }else if(this.type === ENTITY_TYPE_ENUM.FLOAT_RIGHT) {
            if(this.direction === DIRECTION_ENUM.RIGHT){//右侧浮台初始状态
                tileInfo[x][y].moveable = true
                tileInfo[x+1][y].moveable = false
            }else if(this.direction === DIRECTION_ENUM.LEFT){//左侧浮台改变状态
                tileInfo[x][y].moveable = false
                tileInfo[x+1][y].moveable = true
            }
        }
    }

    initAnimationEvent(id: string) {
        if (id !== this.id) {
            return
        }
        this.fsm.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.fsm.animationComponent.defaultClip.name
            const whiteList = ['move']
            if(whiteList.some(item => name.includes(item))) {
                this.fsm.setParams(PARAME_NAME_ENUM.IDLE, true)
                EventManager.Instance.emit(EVENT_ENUM.FLOAT_IDLE)
                //浮台改变方向
                switch(this.direction) {
                    case DIRECTION_ENUM.LEFT:
                        this.direction = DIRECTION_ENUM.RIGHT
                        break
                    case DIRECTION_ENUM.RIGHT:
                        this.direction = DIRECTION_ENUM.LEFT
                        break
                    case DIRECTION_ENUM.TOP:
                        this.direction = DIRECTION_ENUM.BOTTOM
                        break
                    case DIRECTION_ENUM.BOTTOM:
                        this.direction = DIRECTION_ENUM.TOP
                        break
                    default:
                        break
                }
            }
    })}

}


