import { _decorator, Animation } from 'cc';
import { PARAME_NAME_ENUM } from '../../enums';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../base/StateMachine';
import MoveSubStateMachine from './MoveSubStateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
import LightSubStateMachine from './LightSubStateMachine';
const { ccclass, property } = _decorator;

@ccclass('FloatStateMachine')
export class FloatStateMachine extends StateMachine {
    async init() {
        this.animationComponent = this.addComponent(Animation)
        this.initParams()
        this.initStateMachine()

        await Promise.all(this.waitingList)
    }

    initParams() {
        this.params.set(PARAME_NAME_ENUM.IDLE, getInitParamsTrigger())
        this.params.set(PARAME_NAME_ENUM.MOVE, getInitParamsTrigger())
        this.params.set(PARAME_NAME_ENUM.LIGHT_SWITCH, getInitParamsTrigger())
        this.params.set(PARAME_NAME_ENUM.DIRECTION, getInitParamsNumber())
    }

    initStateMachine() {
        this.stateMachines.set(PARAME_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
        this.stateMachines.set(PARAME_NAME_ENUM.MOVE, new MoveSubStateMachine(this))
        this.stateMachines.set(PARAME_NAME_ENUM.LIGHT_SWITCH, new LightSubStateMachine(this))
        
    }

    run() {
        switch (this.currentState) {
            case this.stateMachines.get(PARAME_NAME_ENUM.MOVE):
            case this.stateMachines.get(PARAME_NAME_ENUM.LIGHT_SWITCH):
            case this.stateMachines.get(PARAME_NAME_ENUM.IDLE):
                if(this.params.get(PARAME_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.IDLE)
                } else if(this.params.get(PARAME_NAME_ENUM.LIGHT_SWITCH).value) {
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.LIGHT_SWITCH)
                } else if(this.params.get(PARAME_NAME_ENUM.MOVE).value) {
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.MOVE)
                } else {
                    this.currentState = this.currentState
                }
                break
            default:
                this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.IDLE)
        }
    }
}