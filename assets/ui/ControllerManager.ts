import { _decorator, Component, Node } from 'cc';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../enums';
import EventManager from '../runtime/EventManager';
const { ccclass, property } = _decorator;

@ccclass('ControllerManager')
export class ControllerManager extends Component {
    handleCtrl(evt:Event, type: string) {
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, type as CONTROLLER_ENUM)
    }
}


