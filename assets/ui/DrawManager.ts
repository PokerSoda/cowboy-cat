import { _decorator, Color, Component, Graphics, view, game, BlockInputEvents, UITransform } from 'cc';
const { ccclass, property } = _decorator;

const SCREEN_WIDTH = view.getVisibleSize().width
const SCREEN_HEIGHT = view.getVisibleSize().height

enum FADE_STATE_ENUM {
    IDLE = 'IDLE',
    FADE_IN = 'FADE_IN',
    FADE_OUT = 'FADE_OUT'
}

export const FADE_TIME = 300

@ccclass('DrawManager')
export class DrawManager extends Component {
    private ctx: Graphics
    private state: FADE_STATE_ENUM = FADE_STATE_ENUM.IDLE
    private oldTime: number = 0
    private fadeTime: number = 0
    private fadeResolve: (value: PromiseLike<null>) => void
    private block: BlockInputEvents

    init(){
        this.block = this.addComponent(BlockInputEvents)
        this.ctx = this.addComponent(Graphics)
        const transform = this.getComponent(UITransform)
        transform.setAnchorPoint(0.5, 0.5)
        transform.setContentSize(SCREEN_WIDTH, SCREEN_HEIGHT)

        this.setAlpha(1)
    }

    setAlpha(alpha: number) {
        this.ctx.clear()
        this.ctx.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
        this.ctx.fillColor = new Color(0, 0, 0, alpha * 255)
        this.ctx.fill()
        this.block.enabled = alpha === 1

    }

    update() {
        const percent = (game.totalTime - this.oldTime) / this.fadeTime
        switch(this.state) {
            case FADE_STATE_ENUM.FADE_IN:
                if(percent < 1) {
                    this.setAlpha(percent)
                }else{
                    this.setAlpha(1)
                    this.state = FADE_STATE_ENUM.IDLE
                    this.fadeResolve(null)
                }
                break
            case FADE_STATE_ENUM.FADE_OUT:
                if(percent < 1) {
                    this.setAlpha(1 - percent)
                }else{
                    this.setAlpha(0)
                    this.state = FADE_STATE_ENUM.IDLE
                    this.fadeResolve(null)
                }
                break
        }
    }

    fadeIn(fadeTime: number = FADE_TIME) {
        this.setAlpha(0)
        this.fadeTime = fadeTime
        this.oldTime = game.totalTime
        this.state = FADE_STATE_ENUM.FADE_IN
        return new Promise((resolve) => {
            this.fadeResolve = resolve
        })
        
    }

    fadeOut(fadeTime: number = FADE_TIME) {
        this.setAlpha(1)
        this.fadeTime = fadeTime
        this.oldTime = game.totalTime
        this.state = FADE_STATE_ENUM.FADE_OUT
        return new Promise((resolve) => {
            this.fadeResolve = resolve
        })
    }
}


