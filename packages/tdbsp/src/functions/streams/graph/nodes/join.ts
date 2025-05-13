import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type JoinNode<K, D0, D1, D2, W> = {
  readonly _tag: "JoinNode"
  children: [Node<K, D0, W>, Node<K, D1, W>]
  readonly fn: (a: D0, b: D1) => D2
}

export const joinNodeMake = <K, D0, D1, D2, W>() => Data.tagged<JoinNode<K, D0, D1, D2, W>>("JoinNode")
