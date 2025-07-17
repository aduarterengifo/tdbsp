import { Data } from "effect"
import type { Node } from "./unions/node.js"

export type ElimNode<K, D, W> = {
  readonly _tag: "ElimNode"
  children: [Node<K, D, W>] // takes nodes whose key is in K0.
}

export const elimNodeMake = <K, D, W>() => Data.tagged<ElimNode<K, D, W>>("ElimNode")
