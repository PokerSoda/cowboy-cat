import {Layers, Node, SpriteFrame, UITransform } from 'cc';

export const createUINode = (name:string = '') => {
    const node = new Node(name)
    const transform = node.addComponent(UITransform)
    transform.setAnchorPoint(0,1)

    node.layer = 1 << Layers.nameToLayer("UI_2D")

    return node
}

export const randomByRange = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min)

// export const randomByLen = (len: number) =>
//     Array.from({length: len}).reduce<string>((total: string, item) => total + Math.floor(Math.random() * 10), '')

 const reg = /\((\d+)\)/

 const getNumberWithinString = (str: string) => {
     return parseInt(str.match(reg)[1] || '0')
 }

export const sortSpriteFrame = (spriteFrames: SpriteFrame[]) => 
    spriteFrames.sort((a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name))
