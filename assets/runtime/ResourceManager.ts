import { resources, SpriteFrame } from "cc"
import Singleton from "../base/Singleton"

export default class ResourceManager extends Singleton{
    static get Instance() {
        return super.GetInstance<ResourceManager>()
    }

    //"texture/tile/tile"
    loadDir(path: string, type: typeof SpriteFrame = SpriteFrame){
        return new Promise<SpriteFrame[]>((resolve, reject)=>{
            resources.loadDir(path, type, function (err, assets) {
                if(err){
                    reject(err)
                    return
                }
    
                resolve(assets)
            })
        })
    
    }
}


