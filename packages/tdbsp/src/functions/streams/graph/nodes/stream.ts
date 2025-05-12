import { Data, type Stream } from "effect"
import type { IZSet } from "../../../../objs/i_z_set.js"

export type StreamNode<K, D, W> = {
  readonly _tag: "StreamNode"
  readonly stream: Stream.Stream<IZSet<K, D, W>>
  children: []
}

export const streamNodeMake = <K, D, W>() => Data.case<StreamNode<K, D, W>>()
