import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type IntegralNode<K, D, W> = {
  readonly _tag: "IntegralNode"
  children: [Node<K, D, W>] // takes nodes whose key is in K0.
}

export const integralNodeMake = <K, D, W>() => Data.tagged<IntegralNode<K, D, W>>("IntegralNode")
