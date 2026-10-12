import { IEnitity, ILevel, ITile } from "db://assets/levels";
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from "db://assets/enums";

// 初始为空数组占位，运行时由 BattleManager 调用 loadLevelMapInfo() 异步填充
const mapInfo: ITile[][] = []

const player: IEnitity = {
  x: 1,
  y: 1,
  direction: DIRECTION_ENUM.BOTTOM,
  state: ENTITY_STATE_ENUM.IDLE,
  type: ENTITY_TYPE_ENUM.PLAYER,
};

const door: IEnitity = {
    x: 9,
    y: 2,
    type: ENTITY_TYPE_ENUM.DOOR,
    direction: DIRECTION_ENUM.RIGHT,
    state: ENTITY_STATE_ENUM.IDLE,
}

const float: Array<IEnitity> = [
  {
    x: 3,
    y: 2,
    type: ENTITY_TYPE_ENUM.FLOAT_BOTTOM,
    direction: DIRECTION_ENUM.BOTTOM,
    state: ENTITY_STATE_ENUM.IDLE,
  },
  {
    x: 2,
    y: 4,
    type: ENTITY_TYPE_ENUM.FLOAT_BOTTOM,
    direction: DIRECTION_ENUM.BOTTOM,
    state: ENTITY_STATE_ENUM.IDLE,
  },
  {
    x: 4,
    y: 4,
    type: ENTITY_TYPE_ENUM.FLOAT_TOP,
    direction: DIRECTION_ENUM.TOP,
    state: ENTITY_STATE_ENUM.IDLE,
  },
  {
    x: 5,
    y: 6,
    type: ENTITY_TYPE_ENUM.FLOAT_RIGHT,
    direction: DIRECTION_ENUM.RIGHT,
    state: ENTITY_STATE_ENUM.IDLE,
  },
  {
    x: 6,
    y: 4,
    type: ENTITY_TYPE_ENUM.FLOAT_LEFT,
    direction: DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
  },
]

const switchs: Array<IEnitity> = [
  {
    x: 2,
    y: 3,
    type: ENTITY_TYPE_ENUM.SWITCH,
    direction: DIRECTION_ENUM.BOTTOM,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 1,
    y: 5,
    type: ENTITY_TYPE_ENUM.SWITCH,
    direction: DIRECTION_ENUM.BOTTOM,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 3,
    y: 5,
    type: ENTITY_TYPE_ENUM.SWITCH,
    direction: DIRECTION_ENUM.BOTTOM,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 4,
    y: 6,
    type: ENTITY_TYPE_ENUM.SWITCH,
    direction: DIRECTION_ENUM.BOTTOM,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 6,
    y: 5,
    type: ENTITY_TYPE_ENUM.SWITCH,
    direction: DIRECTION_ENUM.BOTTOM,
    state: ENTITY_STATE_ENUM.IDLE,
}
]

const enemy: Array<IEnitity> = [{
    x: 4,
    y: 2,
    type: ENTITY_TYPE_ENUM.ENEMY,
    direction: DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 5,
    y: 2,
    type: ENTITY_TYPE_ENUM.ENEMY,
    direction: DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 6,
    y: 3,
    type: ENTITY_TYPE_ENUM.ENEMY,
    direction: DIRECTION_ENUM.RIGHT,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 4,
    y: 3,
    type: ENTITY_TYPE_ENUM.ENEMY,
    direction: DIRECTION_ENUM.TOP,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 5,
    y: 3,
    type: ENTITY_TYPE_ENUM.ENEMY,
    direction: DIRECTION_ENUM.TOP,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 3,
    y: 4,
    type: ENTITY_TYPE_ENUM.ENEMY,
    direction: DIRECTION_ENUM.BOTTOM,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 2,
    y: 6,
    type: ENTITY_TYPE_ENUM.ENEMY,
    direction: DIRECTION_ENUM.BOTTOM,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 3,
    y: 6,
    type: ENTITY_TYPE_ENUM.ENEMY,
    direction: DIRECTION_ENUM.RIGHT,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 4,
    y: 6,
    type: ENTITY_TYPE_ENUM.ENEMY,
    direction: DIRECTION_ENUM.TOP,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 5,
    y: 5,
    type: ENTITY_TYPE_ENUM.ENEMY,
    direction: DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 5,
    y: 4,
    type: ENTITY_TYPE_ENUM.ENEMY,
    direction: DIRECTION_ENUM.TOP,
    state: ENTITY_STATE_ENUM.IDLE,
},
{
    x: 8,
    y: 4,
    type: ENTITY_TYPE_ENUM.ENEMY,
    direction: DIRECTION_ENUM.BOTTOM,
    state: ENTITY_STATE_ENUM.IDLE,
},
]

const level: ILevel = {
  mapInfo,
  player,
  enemy,  
  float,
  portals: [],
  door,
  switchs,
};

export default level;
