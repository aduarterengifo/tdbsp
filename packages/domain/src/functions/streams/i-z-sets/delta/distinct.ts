import { pipe, type Stream } from "effect"
import type { IZSet } from "../../../../objs/i-z-set.js"
import type { Ring } from "../../../../objs/ring.js"
import { iZSetDelayOp } from "../../abelian-group/i-zset-stream/delay.js"
import { iZSetIntOp } from "../../abelian-group/i-zset-stream/int.js"
import { h } from "../lifted-h.js"

export const deltaDistinct = <Key, Data, W>(ring: Ring<W>) => (s: Stream.Stream<IZSet<Key, Data, W>>) =>
  h<Key, Data, W>(ring)(pipe(
    s,
    iZSetIntOp<Key, Data, W>(ring),
    iZSetDelayOp<Key, Data, W>(ring)
  ))(s)
