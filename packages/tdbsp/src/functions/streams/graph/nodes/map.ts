import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type MapNode<K, D0, D1, W> = {
  readonly _tag: "MapNode"
  children: [Node<K, D0, W>] // takes nodes whose key is in K0.
  readonly fn: (d: D0) => D1
}

export const mapNodeMake = <K, D0, D1, W>() => Data.case<MapNode<K, D0, D1, W>>()
