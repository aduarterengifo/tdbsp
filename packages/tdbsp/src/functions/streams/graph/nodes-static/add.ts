import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type AddNode<K, D, W> = {
  readonly _tag: "AddNode"
  children: [Node<K, D, W>, Node<K, D, W>] // takes nodes whose key is in K0.
}

export const addNodeMake = <K, D, W>() => Data.tagged<AddNode<K, D, W>>("AddNode")
