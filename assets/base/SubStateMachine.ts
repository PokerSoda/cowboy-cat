import { _decorator } from 'cc';
import State from './State';
import { StateMachine } from './StateMachine';

const { ccclass, property } = _decorator;

export abstract class SubStateMachine {
    private _currentState: State = null
    stateMachines: Map<string,State> = new Map()

    constructor(public fsm: StateMachine) {
        
    }

    get currentState() {
        return this._currentState
    }

    set currentState(newState: State) {
        this._currentState = newState
        this._currentState.run()
    }

    abstract run() : void

}



