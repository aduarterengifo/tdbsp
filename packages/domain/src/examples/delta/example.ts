import type { Stream } from "effect"
import type { BaseA } from "../../data/a.js"
import type { BaseB } from "../../data/b.js"
import { filter } from "../../functions/streams/lifted-filter.js"
import type { IZSet } from "../../objs/i-z-set.js"

export const deltaCircuitExample = <
  K,
  D0 extends BaseA,
  D1 extends BaseB,
  W
>(
  Sa: Stream.Stream<IZSet<K, D0, W>>,
  Sb: Stream.Stream<IZSet<K, D0, W>>
) => {
  const fSa = filter<K, D0, W>((_, { a }) => a > 2)(Sa)
}
