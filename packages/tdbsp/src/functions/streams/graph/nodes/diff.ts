import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type DiffNode<K, D, W> = {
  readonly _tag: "DiffNode"
  children: [Node<K, D, W>] // takes nodes whose key is in K0.
}

export const diffNodeMake = <K, D, W>() => Data.tagged<DiffNode<K, D, W>>("DiffNode")
