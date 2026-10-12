import { _decorator, Component, Node, Label, Color, view, UITransform } from 'cc';
import levels, { ILevel, loadLevelMapInfo } from '../../levels';
import DataManager, { IRecord } from '../../runtime/DataManager';
import { createUINode } from '../../utile';
import { TileMapManager } from '../tile/TileMapManager';
import { TILE_HEIGHT, TILE_WIDTH } from '../tile/TileManager';
import { PlayerManager } from '../player/PlayerManager';
import EventManager from '../../runtime/EventManager';
import {  ENTITY_STATE_ENUM, EVENT_ENUM } from '../../enums';
import { TileFloatManager } from '../tile/TileFloatManager';
import { EnemyManager } from '../enemy/EnemyManager';
import { PortalManager } from '../portal/PortalManager';
import FadeManager from '../../runtime/FadeManager';
import { ShakeManager } from '../../ui/ShakeManager';
const { ccclass, property } = _decorator;

@ccclass('BattleManager')
export class BattleManager extends Component {
    level: ILevel
    stage: Node

    onLoad() {
        DataManager.Instance.levelIndex = 1
        EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
        EventManager.Instance.on(EVENT_ENUM.SELECT_LEVEL, this.selectLevel, this)
        EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived, this)
        EventManager.Instance.on(EVENT_ENUM.RECORD_STEP, this.record, this)
        EventManager.Instance.on(EVENT_ENUM.REVOKE_STEP, this.revoke, this)
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
        EventManager.Instance.off(EVENT_ENUM.SELECT_LEVEL, this.selectLevel)
        EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.checkArrived)
        EventManager.Instance.off(EVENT_ENUM.RECORD_STEP, this.record)
        EventManager.Instance.off(EVENT_ENUM.REVOKE_STEP, this.revoke)
    }

    onGameOver(){
        this.initLevel()
    }

    start() {
        this.generateStage()
        this.initLevel()
    }

    async initLevel(){
        const level = levels[`level${DataManager.Instance.levelIndex}`]
        if(level) {
            await FadeManager.Instance.fadeIn()
            this.clearLevel()
            this.level = level
            // 通过 resources.load 异步加载当前关卡的 json，找不到则用 ts 中的同步 mapInfo 兜底
            const jsonMapInfo = await loadLevelMapInfo(DataManager.Instance.levelIndex, 10)
            if(jsonMapInfo) {
                this.level.mapInfo = jsonMapInfo
            }
            DataManager.Instance.mapInfo = this.level.mapInfo
            DataManager.Instance.mapRowCount = this.level.mapInfo.length || 0
            DataManager.Instance.mapColumnCount = this.level.mapInfo[0].length || 0
            DataManager.Instance.switchs = this.level.switchs

            await Promise.all([            
                this.generateTileMap(),
                this.generateFloat(),
                this.generatePortal(),
                this.generateEnemy(),
                this.generatePlayer()
            ])

            await FadeManager.Instance.fadeOut()
        }
    }

    clearLevel() {
        this.stage.destroyAllChildren()
        DataManager.Instance.reset()
    }
    generateStage() {
        this.stage = createUINode()
        this.stage.setParent(this.node)
        this.stage.addComponent(ShakeManager)
    }

    async generateTileMap(){
        const tileMap = createUINode()
        await tileMap.setParent(this.stage)
        const tileMapManager = tileMap.addComponent(TileMapManager)
        await tileMapManager.init()
        this.adaptPos()
    }

    async generateEnemy(){
        const promises = []
        for(let i = 0; i < this.level.enemy.length; i++) {
            const enemy = this.level.enemy[i]
            const enemyNode = createUINode()
            enemyNode.setParent(this.stage)
            const enemyManager = enemyNode.addComponent(EnemyManager)
            promises.push(enemyManager.init(enemy))
            DataManager.Instance.enemies.push(enemyManager)
        }
    }

    async generatePlayer(){
        const player = createUINode()
        player.setParent(this.stage)
        const playerManager = player.addComponent(PlayerManager)
        await playerManager.init(this.level.player)
        DataManager.Instance.player = playerManager
        EventManager.Instance.emit(EVENT_ENUM.PLAYER_BORN, true)
    }

    async generateFloat(){
        const promises = []
        for(let i = 0; i < this.level.float.length; i++) {
            const float = this.level.float[i]
            const floatNode = createUINode()
            floatNode.setParent(this.stage)
            const floatManager = floatNode.addComponent(TileFloatManager)
            promises.push(floatManager.init(float))
            DataManager.Instance.floatTile.push(floatManager)
        }
    }

    async generatePortal(){
        const promises = []
        for(let i = 0; i < this.level.portals.length; i++) {
            const portal = this.level.portals[i]
            const portalNode = createUINode()
            portalNode.setParent(this.stage)
            const portalManager = portalNode.addComponent(PortalManager)
            promises.push(portalManager.init(portal))
            DataManager.Instance.portal.push(portalManager)
        }
    }

    adaptPos(){
        const {mapRowCount, mapColumnCount} = DataManager.Instance
        const disX = TILE_WIDTH * mapRowCount / 2
        const disY = TILE_HEIGHT * mapColumnCount / 2 + 100
        this.stage.addComponent(ShakeManager).stop()
        this.stage.setPosition(-disX, disY)
    }

    nextLevel() {
        DataManager.Instance.levelIndex++
        if(DataManager.Instance.levelIndex == 6) {
            DataManager.Instance.levelIndex = 1
        }
        console.log('nextLevel', DataManager.Instance.levelIndex)
        this.initLevel()
    }

    // 从菜单选择关卡：MuneManager 广播 SELECT_LEVEL 时触发
    selectLevel(levelIndex: number) {
        if(levelIndex < 1) levelIndex = 1
        DataManager.Instance.levelIndex = levelIndex
        console.log('selectLevel', DataManager.Instance.levelIndex)
        this.initLevel()
    }

    checkArrived() {
        const doorX = this.level.door.x
        const doorY = this.level.door.y
        const { x: playerX, y: playerY } = DataManager.Instance.player
        if (doorX === playerX && doorY === playerY) {
            if(DataManager.Instance.enemies.every(item => item.state === ENTITY_STATE_ENUM.DEATH)) {
                EventManager.Instance.emit(EVENT_ENUM.NEXT_LEVEL)
            } else {
                // 到达门的位置但仍有敌人存活，弹出提示
                this.showTip('还没有击败全部敌人')
            }
        }
    }

    showTip(msg: string){
        // 避免重复弹出多个提示
        const existing = this.node.getChildByName('TipNode')
        if(existing) return
        const tipNode = createUINode('TipNode')
        const transform = tipNode.getComponent(UITransform)
        transform.setAnchorPoint(0.5, 1)
        const label = tipNode.addComponent(Label)
        label.string = msg
        label.fontSize = 30
        label.lineHeight = 48
        label.color = new Color(255, 255, 255, 255)
        label.horizontalAlign = Label.HorizontalAlign.CENTER
        const { height } = view.getVisibleSize()
        tipNode.setPosition(0, height / 2 - 40)
        this.node.addChild(tipNode)
        this.scheduleOnce(() => {
            tipNode.destroy()
        }, 1.5)
    }

    record(){
        const item: IRecord = {
            player:{
                x: DataManager.Instance.player.x,
                y: DataManager.Instance.player.y,
                type: DataManager.Instance.player.type,
                direction: DataManager.Instance.player.direction,
                state: DataManager.Instance.player.state,
            },
            enemy: DataManager.Instance.enemies.map(({ x, y, direction, state, type }) => ({
                x,
                y,
                type,
                direction,
                state,
            })),
            float: DataManager.Instance.floatTile.map(({ x, y, direction, state, type }) => ({
                x,
                y,
                type,
                direction,
                state,
            })),
            portals: DataManager.Instance.portal.map(({ x, y, direction, state, type }) => ({
                x,
                y,
                type,
                direction,
                state,
            })),
            door: this.level.door,
            switchs: this.level.switchs,
            
        }
        DataManager.Instance.records.push(item)

    }

    revoke(){
        const record = DataManager.Instance.records.pop()
        if(record) {

            DataManager.Instance.player.x = DataManager.Instance.player.targetX = record.player.x
            DataManager.Instance.player.y = DataManager.Instance.player.targetY = record.player.y
            DataManager.Instance.player.direction = record.player.direction
            DataManager.Instance.player.state = ENTITY_STATE_ENUM.IDLE

            for(let i = 0; i < record.enemy.length; i++) {
                DataManager.Instance.enemies[i].x = record.enemy[i].x
                DataManager.Instance.enemies[i].y = record.enemy[i].y
                DataManager.Instance.enemies[i].direction = record.enemy[i].direction
                DataManager.Instance.enemies[i].state = record.enemy[i].state
            }
            
            for(let i = 0; i < record.float.length; i++) {
                DataManager.Instance.floatTile[i].x = record.float[i].x
                DataManager.Instance.floatTile[i].y = record.float[i].y
                DataManager.Instance.floatTile[i].direction = record.float[i].direction
                DataManager.Instance.floatTile[i].state = ENTITY_STATE_ENUM.IDLE
            }

            for(let i = 0; i < record.portals.length; i++) {
                DataManager.Instance.portal[i].x = record.portals[i].x
                DataManager.Instance.portal[i].y = record.portals[i].y
                DataManager.Instance.portal[i].direction = record.portals[i].direction
                DataManager.Instance.portal[i].state = ENTITY_STATE_ENUM.IDLE
            }
        }
    }

}


