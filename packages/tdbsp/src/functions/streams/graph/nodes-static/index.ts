import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type IndexNode<K0, K1, D, W> = {
  readonly _tag: "IndexNode"
  children: [Node<K0, D, W>] // takes nodes whose key is in K0.
  readonly fn: (d: D) => K1
}

export const indexNodeMake = <K0, K1, D, W>() => Data.tagged<IndexNode<K0, K1, D, W>>("IndexNode")
