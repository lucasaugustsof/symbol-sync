export namespace Figma {
  export type NodeType = 'DOCUMENT'

  export interface BaseNode {
    id: string
    name: string
    type: NodeType
    children: Array<BaseNode>
  }

  export interface Image {
    images: Record<string, string>
  }

  export interface Document extends BaseNode {}
}
