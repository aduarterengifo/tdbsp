import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type DeltaJoinNode<K, D0, D1, D2, W> = {
  readonly _tag: "DeltaJoinNode"
  children: [Node<K, D0, W>, Node<K, D1, W>]
  readonly fn: (a: D0, b: D1) => D2
}

export const deltaJoinNodeMake = <K, D0, D1, D2, W>() => Data.tagged<DeltaJoinNode<K, D0, D1, D2, W>>("DeltaJoinNode")
