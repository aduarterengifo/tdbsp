import type { Stream } from "effect"
import { Data } from "effect"
import type { NonEmptyArray } from "effect/Array"
import type { NoSuchElementException } from "effect/Cause"
import type { IZSet } from "../../../../objs/i_z_set.js"
import type { Node } from "./unions/node.js"

export type FixPointNode<K, D0, W> = {
  readonly _tag: "FixPointNode"
  children: [] // takes nodes whose key is in K0.
  readonly fn: (delayedInput: Stream.Stream<IZSet<K, D0, W>, NoSuchElementException | never, never>) => Node<K, D0, W>
  streams: NonEmptyArray<Stream.Stream<IZSet<K, D0, W>>>
}

export const fixPointNodeMake = <K, D0, W>() => Data.tagged<FixPointNode<K, D0, W>>("FixPointNode")
