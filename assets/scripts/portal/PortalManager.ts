import { _decorator, UITransform } from 'cc';
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager';
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, EVENT_ENUM } from '../../enums';
import EventManager from '../../runtime/EventManager';
import { EntityManager } from '../../base/EnitityManager';
import { IEnitity } from '../../levels';
import { PortalStateMachine } from './PortalStateMachine';
const { ccclass, property } = _decorator;

@ccclass('PortalManager')
export class PortalManager extends EntityManager {
    fsm: PortalStateMachine

    async init(params: IEnitity){
        this.id = this.randId()
        this.fsm = this.addComponent(PortalStateMachine)
        await this.fsm.init()
        super.init(params)
        const transform = this.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH , TILE_HEIGHT)

        EventManager.Instance.on(EVENT_ENUM.TRANSFER, this.jump, this)
        EventManager.Instance.on(EVENT_ENUM.TRANSFER_LIGHT, this.lightHandle, this)
        EventManager.Instance.on(EVENT_ENUM.TRANSFER_IDLE, this.idleHandle, this)

    }

    onDestroy(): void {
        EventManager.Instance.off(EVENT_ENUM.TRANSFER, this.jump)
        EventManager.Instance.off(EVENT_ENUM.TRANSFER_LIGHT, this.lightHandle)
        EventManager.Instance.off(EVENT_ENUM.TRANSFER_IDLE, this.idleHandle)
    }

    update(){
        this.node.setPosition(this.x * TILE_WIDTH, - this.y * TILE_HEIGHT)
    }

    jump(index: string){
        if(index === this.id) {this.state = ENTITY_STATE_ENUM.TRANSFER}
        return
    }

    lightHandle(index: string){
        if(index === this.id) {this.state = ENTITY_STATE_ENUM.TRANSFER_LIGHT}
        return
    }

    idleHandle(index: string){
        if(index === this.id) {this.state = ENTITY_STATE_ENUM.IDLE}
        return
    }

}


