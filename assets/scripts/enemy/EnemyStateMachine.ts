import { _decorator, Animation, AnimationClip } from 'cc';
import { PARAME_NAME_ENUM } from '../../enums';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../base/StateMachine';
import State from '../../base/State';
import IdleSubStateMachine from './IdleSubStateMachine';
import DeathSubStateMachine from './DeathSubStateMachine';
import DefenceSubStateMachine from './DefenceSubStateMachine';
const { ccclass, property } = _decorator;

@ccclass('EnemyStateMachine')
export class EnemyStateMachine extends StateMachine {
    async init() {
        this.animationComponent = this.addComponent(Animation)
        this.initParams()
        this.initStateMachine()
        this.initAnimationEvent()

        await Promise.all(this.waitingList)
    }

    initParams() {
        this.params.set(PARAME_NAME_ENUM.IDLE, getInitParamsTrigger())
        this.params.set(PARAME_NAME_ENUM.DEATH, getInitParamsTrigger())
        this.params.set(PARAME_NAME_ENUM.DEFENCE, getInitParamsTrigger())

        this.params.set(PARAME_NAME_ENUM.DIRECTION, getInitParamsNumber())
    }

    initStateMachine() {
        this.stateMachines.set(PARAME_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
        this.stateMachines.set(PARAME_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
        this.stateMachines.set(PARAME_NAME_ENUM.DEFENCE, new DefenceSubStateMachine(this))
        
    }

    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name
            const whiteList = ['defense']
            if(whiteList.some(item => name.includes(item))) {
                this.setParams(PARAME_NAME_ENUM.IDLE, true)
            }
        })
    }

    run() {
        switch (this.currentState) {
            case this.stateMachines.get(PARAME_NAME_ENUM.DEATH):
            case this.stateMachines.get(PARAME_NAME_ENUM.DEFENCE):
            case this.stateMachines.get(PARAME_NAME_ENUM.IDLE):
                if(this.params.get(PARAME_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.IDLE)
                } else if(this.params.get(PARAME_NAME_ENUM.DEFENCE).value) {
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.DEFENCE)
                } else if(this.params.get(PARAME_NAME_ENUM.DEATH).value) {
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.DEATH)
                } else {
                    this.currentState = this.currentState
                }
                break
            default:
                this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.IDLE)
        }
    }
}