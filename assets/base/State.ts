import { AnimationClip,_decorator, Sprite, animation, SpriteFrame  } from "cc";

import ResourceManager from "../runtime/ResourceManager";
import { StateMachine } from "./StateMachine";

export const ANIMATION_SPEED = 1/8

/***
 * 1.需要知道animationClip的路径
 * 2.播放动画animationComponent
 */
export default class State {
    private animationClip: AnimationClip
    constructor(
        private fsm: StateMachine,
        private path: string,
        private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
        private speed: number = ANIMATION_SPEED,
        private event: any[] = []
    ) {
        this.init()
    }

    async init() {
        // 资源异步加载
        const promise = ResourceManager.Instance.loadDir(this.path)
        this.fsm.waitingList.push(promise)
        const spriteFrames = await promise

        this.animationClip = new AnimationClip()

        const track = new animation.ObjectTrack()
        track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
        const filteredFrames = spriteFrames.filter(item => item.name.includes('('))
        const frames: Array<[number, SpriteFrame]> = filteredFrames.map((item,index) => [ANIMATION_SPEED * index, item])
        track.channel.curve.assignSorted(frames)

        this.animationClip.addTrack(track)
        this.animationClip.name = this.path
        this.animationClip.duration = frames.length * ANIMATION_SPEED
        this.animationClip.wrapMode = this.wrapMode

        for (const event of this.event) {
            this.animationClip.events.push(event)
        }
        this.animationClip.updateEventDatas()
    }

    run() {
        if(!this.animationClip){
            console.log('animationClip is null')
            return
        }
        if(this.fsm.animationComponent?.defaultClip?.name === this.animationClip.name){
            return
        }
        this.fsm.animationComponent.defaultClip = this.animationClip
        this.fsm.animationComponent.play()
    }
}


