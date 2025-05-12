import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type SubNode<K, D, W> = {
  readonly _tag: "SubNode"
  children: [Node<K, D, W>, Node<K, D, W>] // takes nodes whose key is in K0.
}

export const subNodeMake = <K, D, W>() => Data.case<SubNode<K, D, W>>()
