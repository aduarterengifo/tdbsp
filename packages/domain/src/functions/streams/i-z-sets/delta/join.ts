import type { Stream } from "effect"
import type { IZSet } from "../../../../objs/i-z-set.js"
import type { Ring } from "../../../../objs/ring.js"
import { iZSetDelayOp } from "../../abelian-group/i-zset-stream/delay.js"
import { iZSetIntOp } from "../../abelian-group/i-zset-stream/int.js"
import { add } from "../../lifted-add.js"
import { join } from "../../lifted-join.js"

export const deltaJoin = <
  K,
  D0,
  D1,
  D2,
  W
>(ring: Ring<W>) =>
(
  fn: (m0: D0, m1: D1) => D2
) =>
(Sb: Stream.Stream<IZSet<K, D1, W>>) =>
(Sa: Stream.Stream<IZSet<K, D0, W>>) => {
  const iSa = iZSetIntOp<K, D0, W>(ring)(Sa)
  const iSb = iZSetIntOp<K, D1, W>(ring)(Sb)
  const iDSb = iZSetDelayOp<K, D1, W>(ring)(iSb)
  const jiSaSb = join<K, D0, D1, D2, W>(ring)(fn)(Sb)(iSa)
  const jiDSbSa = join<K, D0, D1, D2, W>(ring)(fn)(iDSb)(Sa)

  return add(ring)(jiDSbSa)(jiSaSb)
}
