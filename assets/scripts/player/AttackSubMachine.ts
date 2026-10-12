import State from "../../base/State";
import { StateMachine } from "../../base/StateMachine";
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAME_NAME_ENUM, SHAKE_TYPE_ENUM } from "../../enums";
import { ANIMATION_SPEED } from "../../base/State";
import { AnimationClip } from "cc";
import { SubStateMachine } from "../../base/SubStateMachine";

const BASE_URL = "texture/player/attack/"

export default class AttackSubStateMachine extends SubStateMachine {
    constructor(fsm: StateMachine) {
        super(fsm)
        this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}top/`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED,[
            {
            frame: ANIMATION_SPEED * 2,
            func: 'onAttackShake',
            params: [SHAKE_TYPE_ENUM.TOP]},
        
        ]))
        this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}bottom/`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED,[
            {
            frame: ANIMATION_SPEED * 2,
            func: 'onAttackShake',
            params: [SHAKE_TYPE_ENUM.BOTTOM]},
        ]))
        this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}left/`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED,[
            {
            frame: ANIMATION_SPEED * 2,
            func: 'onAttackShake',
            params: [SHAKE_TYPE_ENUM.LEFT]},
        ]))
        this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}right/`, AnimationClip.WrapMode.Normal, ANIMATION_SPEED,[
            {
            frame: ANIMATION_SPEED * 2,
            func: 'onAttackShake',
            params: [SHAKE_TYPE_ENUM.RIGHT]},
        ]))
    }

    run() {
        const value = this.fsm.getParams(PARAME_NAME_ENUM.DIRECTION)
        this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
    }

}
