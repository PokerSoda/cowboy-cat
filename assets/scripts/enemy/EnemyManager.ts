import { _decorator } from 'cc';
import { EntityManager } from '../../base/EnitityManager';
import { IEnitity } from '../../levels';
import EventManager from '../../runtime/EventManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../../enums';
import DataManager from '../../runtime/DataManager';
import { EnemyStateMachine } from './EnemyStateMachine';

const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends EntityManager {

    async init(params: IEnitity) {
        this.id = this.randId()
        this.fsm = this.addComponent(EnemyStateMachine)
        await this.fsm.init()
        super.init(params)

        //EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
        EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this)
    }

    onDestroy() {
        super.onDestroy()
        //EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
        EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDead)
    }

    onDead(id: string) {
        if(this.state === ENTITY_STATE_ENUM.DEATH) {
            return
        }
        if(id !== this.id) {
            return
        }
        const {x:playerX,y:playerY} = DataManager.Instance.player
        if(this.direction === DIRECTION_ENUM.TOP &&
            this.x === playerX && 
            this.y === playerY - 1
        ){
            this.state = ENTITY_STATE_ENUM.DEATH
            return
        }else if(this.direction === DIRECTION_ENUM.BOTTOM &&
            this.x === playerX && 
            this.y === playerY + 1
        ){
            this.state = ENTITY_STATE_ENUM.DEATH
            return
        }else if(this.direction === DIRECTION_ENUM.LEFT &&
            this.x === playerX - 1 && 
            this.y === playerY
        ){
            this.state = ENTITY_STATE_ENUM.DEATH  
            return
        }else if(this.direction === DIRECTION_ENUM.RIGHT &&
            this.x === playerX + 1 && 
            this.y === playerY
        ){
            this.state = ENTITY_STATE_ENUM.DEATH  
            return
        }
        this.state = ENTITY_STATE_ENUM.DEFENCE
    }

    onAttack() {
        if(this.state === ENTITY_STATE_ENUM.DEATH || !DataManager.Instance.player) {
            return
        }
        const {x:playerX,y:playerY} = DataManager.Instance.player

        if((this.direction === DIRECTION_ENUM.TOP || this.direction === DIRECTION_ENUM.BOTTOM) &&
            this.x === playerX && 
            Math.abs(this.y - playerY) <= 1
        ) {
            this.state = ENTITY_STATE_ENUM.ATTACK
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
            console.log('columnenemy attack player')
        }else if((this.direction === DIRECTION_ENUM.LEFT || this.direction === DIRECTION_ENUM.RIGHT) &&
            this.y === playerY && 
            Math.abs(this.x - playerX) <= 1
        ) {
            this.state = ENTITY_STATE_ENUM.ATTACK
            EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
            console.log('row enemy attack player')
        }
    }

}








