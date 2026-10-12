import { _decorator, Animation } from 'cc';
import { PARAME_NAME_ENUM } from '../../enums';
import { getInitParamsTrigger, StateMachine } from '../../base/StateMachine';
import State from '../../base/State';
const { ccclass, property } = _decorator;

@ccclass('PortalStateMachine')
export class PortalStateMachine extends StateMachine {
    async init() {
        this.animationComponent = this.addComponent(Animation)
        this.initParams()
        this.initStateMachine()
        this.initAnimationEvent()

        await Promise.all(this.waitingList)
    }

    initParams() {
        this.params.set(PARAME_NAME_ENUM.IDLE, getInitParamsTrigger())
        this.params.set(PARAME_NAME_ENUM.TRANSFER, getInitParamsTrigger())
        this.params.set(PARAME_NAME_ENUM.TRANSFER_LIGHT, getInitParamsTrigger())

    }

    initStateMachine() {
        this.stateMachines.set(PARAME_NAME_ENUM.IDLE, new State(this, 'texture/portal/idle/'))
        this.stateMachines.set(PARAME_NAME_ENUM.TRANSFER, new State(this, 'texture/portal/jump/'))
        this.stateMachines.set(PARAME_NAME_ENUM.TRANSFER_LIGHT, new State(this, 'texture/portal/light/'))

    }
    
    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name
            const whiteList = ['jump']
            if(whiteList.some(item => name.includes(item))) {
                this.setParams(PARAME_NAME_ENUM.IDLE, true)
            }
        })
    }

    run() {
        switch (this.currentState) {      
            case this.stateMachines.get(PARAME_NAME_ENUM.IDLE):
            case this.stateMachines.get(PARAME_NAME_ENUM.TRANSFER):
            case this.stateMachines.get(PARAME_NAME_ENUM.TRANSFER_LIGHT):
                if(this.params.get(PARAME_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.IDLE)
                } else if(this.params.get(PARAME_NAME_ENUM.TRANSFER).value){
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.TRANSFER)
                } else if(this.params.get(PARAME_NAME_ENUM.TRANSFER_LIGHT).value){
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.TRANSFER_LIGHT)
                } else {
                    this.currentState = this.currentState
                }
                break
            default:
                this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.IDLE) 
        }
    }
}



