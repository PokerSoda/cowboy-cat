import Singleton from "../base/Singleton"
import { IEnitity, ILevel, ITile } from "../levels"
import { EnemyManager } from "../scripts/enemy/EnemyManager"
import { PlayerManager } from "../scripts/player/PlayerManager"
import { PortalManager } from "../scripts/portal/PortalManager"
import { TileFloatManager } from "../scripts/tile/TileFloatManager"
import { TileManager } from "../scripts/tile/TileManager"

export type IRecord = Omit<ILevel, 'mapInfo'>

export default class DataManager extends Singleton{
    playerManager: any
    static get Instance() {
        return super.GetInstance<DataManager>()
    }
    mapInfo: Array<Array<ITile>>
    tileInfo: Array<Array<TileManager>>

    mapRowCount: number = 0
    mapColumnCount: number = 0
    levelIndex: number = 1
    records: IRecord[]
    player: PlayerManager
    floatTile: TileFloatManager[]
    enemies: EnemyManager[]
    portal: PortalManager[]
    switchs: IEnitity[]

    reset() {
        this.mapInfo = []
        this.tileInfo = []
        this.mapRowCount = 0
        this.mapColumnCount = 0
        this.records = []
        this.player = null
        this.floatTile = []
        this.enemies = []
        this.portal = []
        this.switchs = []
    }

}
