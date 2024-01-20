export namespace Figma {
  export type NodeType = 'DOCUMENT' | 'CANVAS'

  export interface BaseNode {
    id: string
    name: string
    type: NodeType
    scrollBehavior: 'SCROLLS' | string
    children: Array<BaseNode>
  }

  export interface Color {
    r: number
    g: number
    b: number
    a: number
  }

  export interface Canvas extends BaseNode {
    children: Array<BaseNode>
    backgroundColor: Color
    prototypeStartNodeID: string | null
    flowStartingPoints: Array<any>
    prototypeDevice: object
  }

  export interface Document extends BaseNode {
    children: Array<Canvas>
  }

  export interface Image {
    images: Record<string, string>
  }
}
