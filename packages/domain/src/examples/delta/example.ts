import { Data, pipe, type Stream } from "effect"
import type { BaseA, BaseAMap } from "../../data/a.js"
import type { BaseB, BaseBMap } from "../../data/b.js"
import { deltaJoin } from "../../functions/streams/i-z-sets/delta/join.js"
import { deindex } from "../../functions/streams/lifted-de-index.js"
import { filter } from "../../functions/streams/lifted-filter.js"
import { map } from "../../functions/streams/lifted-map.js"
import type { IZSet } from "../../objs/i-z-set.js"
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
) => {
  const mfSa = pipe(
    Sa,
    filter<K, D0, W>((_, { a }) => a > 2),
    map<K, D0, BaseAMap, W>(({ id, x }) =>
      Data.struct({
        x,
        id
      })
    ),
    deindex<K, BaseAMap, W>()
  )

  const mfSb = pipe(
    Sb,
    filter<K, D1, W>((_, { s }) => s > 5),
    map<K, D1, BaseBMap, W>(({ id, y }) =>
      Data.struct({
        y,
        id
      })
    )
  )

  const joinRes = deltaJoin(ring)(({ x }, { y }) => Data.struct({ x, y }))
}
