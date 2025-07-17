import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type IntroNode<K, D, W> = {
  readonly _tag: "IntroNode"
  children: [Node<K, D, W>] // takes nodes whose key is in K0.
}

export const introNodeMake = <K, D, W>() => Data.tagged<IntroNode<K, D, W>>("IntroNode")
