import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type UnionNode<K, D, W> = {
  readonly _tag: "UnionNode"
  children: [Node<K, D, W>, Node<K, D, W>] // takes nodes whose key is in K0.
}

export const unionNodeMake = <K, D, W>() => Data.tagged<UnionNode<K, D, W>>("UnionNode")
