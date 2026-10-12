import { IEnitity, ILevel, ITile } from "db://assets/levels";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from "db://assets/enums";

// 初始为空数组占位，运行时由 BattleManager 调用 loadLevelMapInfo() 异步填充
const mapInfo: ITile[][] = []

const player: IEnitity = {
    x: 4,
    y: 7,
    type: ENTITY_TYPE_ENUM.PLAYER,
    direction: DIRECTION_ENUM.TOP,
    state: ENTITY_STATE_ENUM.IDLE,
}

const float: Array<IEnitity> = [
  {
    x: 4,
    y: 4,
    type: ENTITY_TYPE_ENUM.FLOAT_RIGHT,
    direction: DIRECTION_ENUM.RIGHT,
    state: ENTITY_STATE_ENUM.IDLE,
  }
]

const door: IEnitity = {
    x: 5,
    y: 1,
    type: ENTITY_TYPE_ENUM.DOOR,
    direction: DIRECTION_ENUM.BOTTOM,
    state: ENTITY_STATE_ENUM.IDLE,
}

const switchs: Array<IEnitity> = [
  {
    x: 5,
    y: 5,
    type: ENTITY_TYPE_ENUM.SWITCH,
    direction: DIRECTION_ENUM.BOTTOM,
    state: ENTITY_STATE_ENUM.IDLE,
}
]

const level: ILevel = {
    mapInfo,
    player,
    float,
    enemy: [],
    portals: [],
    door,
    switchs,
}

export default level

