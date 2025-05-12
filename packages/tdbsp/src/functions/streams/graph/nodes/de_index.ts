import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type DeIndexNode<K, D, W> = {
  readonly _tag: "DeIndexNode"
  children: [Node<K, D, W>] // takes nodes whose output is D.
}

export const deIndexNodeMake = <K, D, W>() => Data.case<DeIndexNode<K, D, W>>()
