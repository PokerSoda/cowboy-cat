import { _decorator, Animation } from 'cc';
import { PARAME_NAME_ENUM } from '../../enums';
import { getInitParamsNumber, getInitParamsTrigger, StateMachine } from '../../base/StateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
import State from '../../base/State';
import AttackSubStateMachine from './AttackSubMachine';
const { ccclass, property } = _decorator;

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
    async init() {
        this.animationComponent = this.addComponent(Animation)
        this.initParams()
        this.initStateMachine()
        this.initAnimationEvent()

        await Promise.all(this.waitingList)
    }

    initParams() {
        this.params.set(PARAME_NAME_ENUM.IDLE, getInitParamsTrigger())
        this.params.set(PARAME_NAME_ENUM.ATTACK, getInitParamsTrigger())
        this.params.set(PARAME_NAME_ENUM.TRANSFER_PLAYER, getInitParamsTrigger())

        this.params.set(PARAME_NAME_ENUM.DIRECTION, getInitParamsNumber())
        this.params.set(PARAME_NAME_ENUM.WALKTOP, getInitParamsTrigger())
        this.params.set(PARAME_NAME_ENUM.WALKBOTTOM, getInitParamsTrigger())
        this.params.set(PARAME_NAME_ENUM.WALKLEFT, getInitParamsTrigger())
        this.params.set(PARAME_NAME_ENUM.WALKRIGHT, getInitParamsTrigger())
    }

    initStateMachine() {
        this.stateMachines.set(PARAME_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
        this.stateMachines.set(PARAME_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
        this.stateMachines.set(PARAME_NAME_ENUM.TRANSFER_PLAYER, new State(this, 'texture/player/transfer'))
        this.stateMachines.set(PARAME_NAME_ENUM.WALKTOP, new State(this, 'texture/player/walk/top/'))
        this.stateMachines.set(PARAME_NAME_ENUM.WALKBOTTOM, new State(this, 'texture/player/walk/bottom/'))
        this.stateMachines.set(PARAME_NAME_ENUM.WALKLEFT, new State(this, 'texture/player/walk/left/'))
        this.stateMachines.set(PARAME_NAME_ENUM.WALKRIGHT, new State(this, 'texture/player/walk/right/'))
    }

    initAnimationEvent() {
        this.animationComponent.on(Animation.EventType.FINISHED, () => {
            const name = this.animationComponent.defaultClip.name
            const whiteList = ['walk', 'attack', 'transfer']
            if(whiteList.some(item => name.includes(item))) {
                this.setParams(PARAME_NAME_ENUM.IDLE, true)
            }
        })
    }

    run() {
        switch (this.currentState) {
            case this.stateMachines.get(PARAME_NAME_ENUM.WALKTOP):
            case this.stateMachines.get(PARAME_NAME_ENUM.WALKBOTTOM):
            case this.stateMachines.get(PARAME_NAME_ENUM.WALKLEFT):
            case this.stateMachines.get(PARAME_NAME_ENUM.WALKRIGHT):
            case this.stateMachines.get(PARAME_NAME_ENUM.ATTACK):
            case this.stateMachines.get(PARAME_NAME_ENUM.TRANSFER_PLAYER):
            case this.stateMachines.get(PARAME_NAME_ENUM.IDLE):
                if(this.params.get(PARAME_NAME_ENUM.IDLE).value) {
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.IDLE)
                } else if(this.params.get(PARAME_NAME_ENUM.ATTACK).value) {
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.ATTACK)
                } else if(this.params.get(PARAME_NAME_ENUM.WALKTOP).value) {
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.WALKTOP)
                } else if(this.params.get(PARAME_NAME_ENUM.WALKBOTTOM).value) {
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.WALKBOTTOM)
                } else if(this.params.get(PARAME_NAME_ENUM.WALKLEFT).value) {
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.WALKLEFT)
                } else if(this.params.get(PARAME_NAME_ENUM.TRANSFER_PLAYER).value){
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.TRANSFER_PLAYER)
                }else if(this.params.get(PARAME_NAME_ENUM.WALKRIGHT).value) {
                    this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.WALKRIGHT)
                } else {
                    this.currentState = this.currentState
                }
                break
            default:
                this.currentState = this.stateMachines.get(PARAME_NAME_ENUM.IDLE) 
        }
    }
}



