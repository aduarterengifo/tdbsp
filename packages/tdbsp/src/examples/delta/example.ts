import { Data, Effect, pipe, type Stream } from "effect"
import type { BaseA, BaseAMap } from "../../data/a.js"
import type { BaseB, BaseBMap } from "../../data/b.js"
import type { BaseJoined } from "../../data/c.js"
import { deltaJoin } from "../../functions/streams/i_z_sets/delta/join.js"
import { logStream } from "../../functions/streams/i_z_sets/utils.js"
import { deindex } from "../../functions/streams/lifted_de_index.js"
import { filter } from "../../functions/streams/lifted_filter.js"
import { index } from "../../functions/streams/lifted_index.js"
import { map } from "../../functions/streams/lifted_map.js"
import type { IZSet } from "../../objs/i_z_set.js"
import type { Ring } from "../../objs/ring.js"

export const deltaCircuitExample = <
  K,
  D0 extends BaseA,
  D1 extends BaseB,
  W
>(ring: Ring<W>) =>
(
  Sa: Stream.Stream<IZSet<K, D0, W>>,
  Sb: Stream.Stream<IZSet<K, D1, W>>
): Effect.Effect<Stream.Stream<IZSet<number, BaseJoined, W>>, never, never> =>
  Effect.gen(function*() {
    yield* Effect.logInfo("info")
    const fSa = pipe(
      Sa,
      filter<K, D0, W>((_, { a }) => a > 2),
      map<K, D0, BaseAMap, W>(({ id, x }) =>
        Data.struct({
          x,
          id
        })
      ),
      deindex<K, BaseAMap, W>(),
      index<number, BaseAMap, W>(({ id }) => id)
    )

    yield* logStream(fSa)

    const fSb = pipe(
      Sb,
      filter<K, D1, W>((_, { s }) => s > 5),
      map<K, D1, BaseBMap, W>(({ id, y }) =>
        Data.struct({
          y,
          id
        })
      ),
      deindex<K, BaseBMap, W>(),
      index<number, BaseBMap, W>(({ id }) => id)
    )

    yield* logStream(fSb)

    return yield* deltaJoin<number, BaseAMap, BaseBMap, BaseJoined, W>(ring)(({ x }, { y }) => Data.struct({ x, y }))(
      fSb
    )(
      fSa
    )
  })
