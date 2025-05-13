import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type FilterNode<K, D, W> = {
  readonly _tag: "FilterNode"
  children: [Node<K, D, W>] // takes nodes whose key is in K0.
  readonly fn: (w: W, d: D) => boolean
}

export const filterNodeMake = <K, D, W>() => Data.tagged<FilterNode<K, D, W>>("FilterNode")
