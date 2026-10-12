import level1 from "db://assets/levels/level1"
import level2 from "db://assets/levels/level2"
import level3 from "db://assets/levels/level3"
import level4 from "db://assets/levels/level4"
import level5 from "db://assets/levels/level5"
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from "../enums"
import { JsonAsset, resources } from "cc";

export interface IEnitity{
    x: number,
    y: number,
    type: ENTITY_TYPE_ENUM,
    direction: DIRECTION_ENUM,
    state: ENTITY_STATE_ENUM,
}

export interface ITile{
    src: number | null,
    type: TILE_TYPE_ENUM | null,
}

export interface ILevel{
    mapInfo: Array<Array<ITile>>
    player: IEnitity,
    float: Array<IEnitity>,
    enemy: Array<IEnitity>,
    portals: Array<IEnitity>,
    door: IEnitity,
    switchs: Array<IEnitity>,
}

// src 数值到 TILE_TYPE_ENUM 的映射表（参考 level1.ts 中已有的对应关系）
export const SRC_TO_TYPE_MAP: Record<number, TILE_TYPE_ENUM> = {
    1: TILE_TYPE_ENUM.FLOOR,
    2: TILE_TYPE_ENUM.FLOOR,
    5: TILE_TYPE_ENUM.WALL_COLUMN,
    9: TILE_TYPE_ENUM.WALL_ROW,
    13: TILE_TYPE_ENUM.WALL_LEFT_BOTTOM,
    14: TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM,
    15: TILE_TYPE_ENUM.WALL_LEFT_TOP,
    16: TILE_TYPE_ENUM.WALL_RIGHT_TOP,
    17: TILE_TYPE_ENUM.CLIFF_CENTER,
    18: TILE_TYPE_ENUM.CLIFF_LEFT,
    19: TILE_TYPE_ENUM.CLIFF_RIGHT,
    20: TILE_TYPE_ENUM.WALL_LEFT_BOTTOM,
    21: TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM,
    22: TILE_TYPE_ENUM.FLOAT_FLOOR,
    23: TILE_TYPE_ENUM.FLOOR,
    24: TILE_TYPE_ENUM.FLOOR,
    25: TILE_TYPE_ENUM.FLOOR,
    26: TILE_TYPE_ENUM.FLOOR,
    27: TILE_TYPE_ENUM.FLOOR,
    28: TILE_TYPE_ENUM.FLOOR,
}

/**
 * 把 Tiled 导出的一维 data 数组转换成 mapInfo 二维数组
 * @param data Tiled layers[0].data 一维数组
 * @param size 地图边长，默认 10
 * @returns ITile[][] 二维数组
 */
export function transformJsonToMapInfo(data: number[], size: number = 10): ITile[][] {
    const mapInfo: ITile[][] = []
    for(let row = 0; row < size; row++) {
        const rowData: ITile[] = []
        for(let col = 0; col < size; col++) {
            const value = data[col * size + row]
            if(value === 0) {
                rowData.push({ src: null, type: null })
            } else {
                rowData.push({ src: value, type: SRC_TO_TYPE_MAP[value] ?? null })
            }
        }
        mapInfo.push(rowData)
    }
    return mapInfo
}

const levels: Record<string, ILevel> = {
    level1,
    level2,
    level3,
    level4,
    level5,
}

export default levels

/**
 * 通用关卡 mapInfo 加载器：根据 levelIndex 加载对应 json 文件
 * 找不到资源时返回 null，调用方可用 ts 中的同步 mapInfo 兜底
 */
export function loadLevelMapInfo(levelIndex: number, size: number = 10): Promise<ITile[][] | null> {
    return new Promise((resolve) => {
        resources.load(`levels/level${levelIndex}`, JsonAsset, (err, data: JsonAsset) => {
            if(err) {
                resolve(null)
                return
            }
            const json = data.json as { layers: Array<{ data: number[] }> }
            const layersData = json.layers[0].data
            resolve(transformJsonToMapInfo(layersData, size))
        })
    })
}
