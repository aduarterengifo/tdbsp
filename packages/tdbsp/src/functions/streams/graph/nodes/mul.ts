import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type MulNode<K, D, W> = {
  readonly _tag: "MulNode"
  children: [Node<K, D, W>, Node<K, D, W>] // takes nodes whose key is in K0.
  readonly fn: (d: D) => D
}

export const mulNodeMake = <K, D, W>() => Data.tagged<MulNode<K, D, W>>("MulNode")
