import { pipe, type Stream } from "effect"
import type { IZSet } from "../../../../objs/i_z_set.js"
import type { Ring } from "../../../../objs/ring.js"
import { iZSetDelayOp } from "../../abelian-group/i_zset_stream/delay.js"
import { iZSetIntOp } from "../../abelian-group/i_zset_stream/int.js"
import { h } from "../lifted_h.js"

export const deltaDistinct = <Key, Data, W>(ring: Ring<W>) => (s: Stream.Stream<IZSet<Key, Data, W>>) =>
  h<Key, Data, W>(ring)(pipe(
    s,
    iZSetIntOp<Key, Data, W>(ring),
    iZSetDelayOp<Key, Data, W>(ring)
  ))(s)
