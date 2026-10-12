import { _decorator, Component, Sprite, UITransform } from 'cc';
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAME_NAME_ENUM } from '../enums';
import { TILE_HEIGHT, TILE_WIDTH } from '../scripts/tile/TileManager';
import { IEnitity } from '../levels';
import { StateMachine } from './StateMachine';

const { ccclass, property } = _decorator;

@ccclass('EntityManager')
export class EntityManager extends Component {
    id: string = ''
    x: number = 0
    y: number = 0
    fsm: StateMachine
    _direction: DIRECTION_ENUM
    _state: ENTITY_STATE_ENUM
    type: ENTITY_TYPE_ENUM

    get direction() {
        return this._direction
    }

    set direction(newDirection: DIRECTION_ENUM) {
        this._direction = newDirection
        this.fsm.setParams(PARAME_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction])
    }

    set state(newState: ENTITY_STATE_ENUM) {
        this._state = newState
        this.fsm.setParams(this._state, true)
    }

    get state() {
        return this._state
    }

    async init(params: IEnitity) {
        const sprite = this.addComponent(Sprite)
        sprite.sizeMode = Sprite.SizeMode.CUSTOM

        const transform = this.getComponent(UITransform)
        transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)

        this.x = params.x
        this.y = params.y
        this.type = params.type
        this.direction = params.direction
        this.state = params.state
    }

    update(){
        this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, - this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
    }

    onDestroy() {}

    randId = (len: number = 4) => {
        return Math.random().toString(36).substring(2, len + 2)
    }

}


