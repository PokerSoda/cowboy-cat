import State from "../../base/State";
import { StateMachine } from "../../base/StateMachine";
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAME_NAME_ENUM } from "../../enums";
import { SubStateMachine } from "../../base/SubStateMachine";

const BASE_URL = "texture/float/idle/"

export default class IdleSubStateMachine extends SubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm)
        this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}top/`))
        this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}bottom/`))
        this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}left/`))
        this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}right/`))
    }

    run() {
        const value = this.fsm.getParams(PARAME_NAME_ENUM.DIRECTION)
        this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
    }

}
