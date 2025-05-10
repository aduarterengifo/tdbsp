import { Effect, type Stream } from "effect"
import type { IZSet } from "../../../../objs/i_z_set.js"
import type { Ring } from "../../../../objs/ring.js"
import { iZSetDelayOp } from "../../abelian-group/i_zset_stream/delay.js"
import { iZSetIntOp } from "../../abelian-group/i_zset_stream/int.js"
import { add } from "../../lifted_add.js"
import { join } from "../../lifted_join.js"
import { logStream } from "../utils.js"

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
(Sa: Stream.Stream<IZSet<K, D0, W>>): Effect.Effect<Stream.Stream<IZSet<K, D2, W>>, never, never> =>
  Effect.gen(function*() {
    const iSa = iZSetIntOp<K, D0, W>(ring)(Sa)
    yield* logStream(iSa)
    const iSb = iZSetIntOp<K, D1, W>(ring)(Sb)
    yield* logStream(iSb)
    const iDSb = iZSetDelayOp<K, D1, W>(ring)(iSb)
    yield* logStream(iDSb)

    const jiSaSb = join<K, D0, D1, D2, W>(ring)(fn)(Sb)(iSa)
    yield* logStream(jiSaSb)
    const jiDSbSa = join<K, D0, D1, D2, W>(ring)(fn)(iDSb)(Sa)
    yield* logStream(jiDSbSa)
    const result = add<K, D2, W>(ring)(jiDSbSa)(jiSaSb)
    yield* logStream(result)
    return result
  })
