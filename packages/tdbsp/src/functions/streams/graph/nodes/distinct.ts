import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type DistinctNode<K, D, W> = {
  readonly _tag: "DistinctNode"
  children: [Node<K, D, W>] // takes nodes whose output is D.
}

export const distinctNodeMake = <K, D, W>() => Data.tagged<DistinctNode<K, D, W>>("DistinctNode")
