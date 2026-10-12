import { RenderRoot2D, director, game} from "cc"
import Singleton from "../base/Singleton"
import { DrawManager } from "../ui/DrawManager"
import { createUINode } from "../utile"


export default class FadeManager extends Singleton{
    static get Instance() {
        return super.GetInstance<FadeManager>()
    }

    private _fader: DrawManager = null

    get fader() {
        if(this._fader !== null) {
            return this._fader
        }
        const root = createUINode()
        root.addComponent(RenderRoot2D)

        const fadeNode = createUINode()
        fadeNode.setParent(root)
        fadeNode.addComponent(DrawManager)
        this._fader = fadeNode.getComponent(DrawManager)
        this._fader.init()
        // 持久化节点
        director.addPersistRootNode(root)

        return this._fader
    }

    fadeIn(){
        return this.fader.fadeIn()
    }

    fadeOut(){
        return this.fader.fadeOut()
    }
}
