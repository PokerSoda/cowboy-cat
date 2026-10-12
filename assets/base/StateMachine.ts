import { _decorator, AnimationClip,Animation, Component, Node, SpriteFrame } from 'cc';
import { FSM_PARAMS_TYPE_ENUM } from '../enums';
import State from './State';
import { SubStateMachine } from './SubStateMachine';

const { ccclass, property } = _decorator;

type ParamsValueType = boolean | number

export interface IParamsValue {
    type: FSM_PARAMS_TYPE_ENUM
    value: ParamsValueType
}

export const getInitParamsTrigger = () => {
    return {
        type:FSM_PARAMS_TYPE_ENUM.TRIGGER,
        value: false
    }
}

export const getInitParamsNumber = () => {
    return {
        type:FSM_PARAMS_TYPE_ENUM.NUMBER,
        value: 0
    }
}

@ccclass('StateMachine')
export abstract class StateMachine extends Component {
    private _currentState: State | SubStateMachine = null    // 当前状态
    params: Map<string, IParamsValue> = new Map()  // 参数列表
    stateMachines: Map<string,State | SubStateMachine> = new Map()  // 状态机列表
    animationComponent: Animation
    waitingList:Array<Promise<SpriteFrame[]>> = []

    getParams(paramsName: string){
        if(this.params.has(paramsName)) {
            return this.params.get(paramsName).value
        }
    }

    setParams(paramsName: string, value: ParamsValueType) {
        if(this.params.has(paramsName)) {
            this.params.get(paramsName).value = value
            this.run()
            this.resetTrigger()
        }
    }

    get currentState() {
        return this._currentState
    }

    set currentState(newState) {
        this._currentState = newState
        this._currentState.run()
    }

    resetTrigger() {
        this.params.forEach((item) => {
            if(item.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
                item.value = false
            }
        })
    }

    abstract init() : void
    abstract run() : void
}


