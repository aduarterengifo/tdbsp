import { Data, type Stream } from "effect"
import type { IZSet } from "../../../../objs/i_z_set.js"

export type IZSetNode<K, D, W> = {
  readonly _tag: "IZSetNode"
  readonly stream: Stream.Stream<IZSet<K, D, W>>
  children: []
}

export const IZSetNodeMake = <K, D, W>() => Data.tagged<IZSetNode<K, D, W>>("IZSetNode")
