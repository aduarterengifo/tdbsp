import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type PlaceholderNode<K, D0, W> = {
  readonly _tag: "PlaceholderNode"
  children: [Node<K, D0, W>] // takes nodes whose key is in K0.
}

export const placeholderNodeMake = <K, D0, W>() => Data.tagged<PlaceholderNode<K, D0, W>>("PlaceholderNode")
