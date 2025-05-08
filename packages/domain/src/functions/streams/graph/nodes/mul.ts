import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type MulNode<K, D, W> = {
  readonly _tag: "MulNode"
  readonly children: [Node<K, D, W>, Node<K, D, W>] // takes nodes whose key is in K0.
}

export const mulNodeMake = <K, D, W>() => Data.case<MulNode<K, D, W>>()
