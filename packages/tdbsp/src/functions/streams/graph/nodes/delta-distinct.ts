import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type DeltaDistinctNode<K, D, W> = {
  readonly _tag: "DeltaDistinctNode"
  children: [Node<K, D, W>] // takes nodes whose output is D.
}

export const deltaDistinctNodeMake = <K, D, W>() => Data.case<DeltaDistinctNode<K, D, W>>()
