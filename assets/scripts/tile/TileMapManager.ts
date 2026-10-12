import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;
import { createUINode, randomByRange } from '../../utile';
import { TileManager } from './TileManager';
import ResourceManager from '../../runtime/ResourceManager';
import DataManager from '../../runtime/DataManager';
import levels from '../../levels';

@ccclass('TileMapManager')
export class TileMapManager extends Component {
    async init(){
        const { mapInfo } = DataManager.Instance
        const spriteFrames = await ResourceManager.Instance.loadDir("texture/tile/tile")
        DataManager.Instance.tileInfo = []
        for (let i = 0; i < mapInfo.length; i++) {
            const column = mapInfo[i];
            DataManager.Instance.tileInfo[i] = []
            for (let j = 0; j < column.length; j++) {
                const item = column[j];
                if (item.src === null || item.type === null){
                    continue
                }

                
                let number = item.src
                if ((number === 1 || number === 5 || number === 9) && i % 4 === 0 && j % 2 === 0){
                    number += randomByRange(0,2)
                }

                const imgSrc = `tile (${number})`
                const node= createUINode()
                const spriteFrame = spriteFrames.find(v => v.name === imgSrc) || spriteFrames[0]

                const tileManager = node.addComponent(TileManager)
                const type = item.type
                tileManager.init(type, spriteFrame, i, j)
                DataManager.Instance.tileInfo[i][j] = tileManager
                node.setParent(this.node)
            }
        }
    }


}


