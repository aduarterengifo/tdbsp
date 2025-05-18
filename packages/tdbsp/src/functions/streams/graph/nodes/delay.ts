import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type DelayNode<K, D0, W> = {
  readonly _tag: "DelayNode"
  children: [Node<K, D0, W>] // takes nodes whose key is in K0.
}

export const delayNodeMake = <K, D0, W>() => Data.tagged<DelayNode<K, D0, W>>("DelayNode")
