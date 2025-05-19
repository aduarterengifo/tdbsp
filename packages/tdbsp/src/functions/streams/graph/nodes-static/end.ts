import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type EndNode<K, D, W> = {
  readonly _tag: "EndNode"
  children: [Node<K, D, W>]
}

export const endNodeMake = <K, D, W>() => Data.tagged<EndNode<K, D, W>>("EndNode")
