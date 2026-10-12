import { DIRECTION_ORDER_ENUM, PARAME_NAME_ENUM } from "../enums"
import { SubStateMachine } from "./SubStateMachine"


export default class DirectionSubStateMachine extends SubStateMachine {

    run() {
        const value = this.fsm.getParams(PARAME_NAME_ENUM.DIRECTION)
        this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
    }

}

