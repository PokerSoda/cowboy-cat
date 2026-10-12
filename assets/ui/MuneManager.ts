import { _decorator, Component, Node, Button, Label, UITransform, Sprite, SpriteFrame, Canvas, director } from 'cc';
import { CONTROLLER_ENUM, EVENT_ENUM } from '../enums';
import EventManager from '../runtime/EventManager';
import { createUINode } from '../utile';

const { ccclass, property } = _decorator;

@ccclass('MuneManager')
export class MuneManager extends Component {
    // 菜单面板背景图：在 Inspector 把图片（SpriteFrame）拖到这里即可显示
    @property({ type: SpriteFrame, tooltip: '菜单面板背景图，建议 300x360 附近，会拉伸到面板大小' })
    menuBg: SpriteFrame | null = null

    // 已创建的菜单面板节点（重复点击 MUNE 时切换显示/隐藏）
    private menuNode: Node | null = null

    // MUNE 按钮点击回调（保持原有写法，把按钮事件转成 MENU 事件广播出去）
    handleCtrl(evt:Event, type: string) {
        EventManager.Instance.emit(EVENT_ENUM.MENU, type as CONTROLLER_ENUM)
    }

    onLoad() {
        // 通过事件绑定方式监听 MENU：解耦按钮触发与菜单弹出逻辑
        EventManager.Instance.on(EVENT_ENUM.MENU, this.toggleMenu, this)
    }

    onDestroy() {
        EventManager.Instance.off(EVENT_ENUM.MENU, this.toggleMenu)
    }

    // 切换菜单显示/隐藏
    toggleMenu() {
        if(!this.menuNode) {
            this.createMenu()
            return
        }
        this.menuNode.active = !this.menuNode.active
    }

    // 找 Canvas 节点作为菜单挂载点，让菜单位于屏幕中央（Canvas 的原点 0,0 就是屏幕中心）
    private findCanvas(): Node {
        const scene = director.getScene()
        if(scene) {
            for(const child of scene.children) {
                if(child.getComponent(Canvas)) return child
            }
        }
        return this.node
    }

    // 动态创建菜单面板 + 关卡按钮
    private createMenu() {
        const menu = createUINode('MenuPanel')
        // 挂到 Canvas 下：position (0,0) 即屏幕中央，与 MuneManager 自身位置无关
        const parent = this.findCanvas()
        menu.setParent(parent)

        const menuTransform = menu.getComponent(UITransform)
        menuTransform.setContentSize(300, 360)
        menuTransform.setAnchorPoint(0.5, 0.5)
        menu.setPosition(0, 0, 0)

        // 背景图：用户在 Inspector 拖入 menuBg 后自动显示，按面板大小拉伸
        if(this.menuBg) {
            const sprite = menu.addComponent(Sprite)
            sprite.spriteFrame = this.menuBg
            sprite.type = Sprite.Type.SIMPLE
            sprite.sizeMode = Sprite.SizeMode.CUSTOM  // false: 按 UITransform 大小拉伸；true: 按图片原始尺寸显示
        }

        // 关卡选项
        const levelOptions = [1, 2, 3, 4, 5]
        levelOptions.forEach((level, idx) => {
            const btn = createUINode(`Level${level}Btn`)
            btn.setParent(menu)
            const btnTransform = btn.getComponent(UITransform)
            btnTransform.setContentSize(220, 70)
            btnTransform.setAnchorPoint(0.5, 0.5)
            // 3 个按钮垂直居中排列，间距 90
            btn.setPosition(0, 90 - idx * 90, 0)

            const label = btn.addComponent(Label)
            label.string = `关卡 ${level}`
            label.fontSize = 36

            const button = btn.addComponent(Button)
            // 用 SCALE 过渡，不需要额外图片资源
            button.transition = Button.Transition.SCALE
            // 按钮点击 → 通过事件广播 SELECT_LEVEL，由 BattleManager 监听并切换关卡
            btn.on(Button.EventType.CLICK, () => {
                EventManager.Instance.emit(EVENT_ENUM.SELECT_LEVEL, level)
                menu.active = false
            }, this)
        })

        this.menuNode = menu
    }
}
