import { HashMap as HM, pipe } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { mapInternal } from "../abstractions/map-internal.js"

/**
 * @pointfree
 */
export const aggregate = <Key, D0, W, Acc, D1>(ring: Ring<W>) =>
(
  initialValue: Acc,
  fold: (acc: Acc, w: W, data: D0) => Acc,
  fin: (x: Acc) => D1
) =>
  mapInternal<Key, D0, D1, W>(
    HM.map((zset, _) => HM.fromIterable([[aggregateInternal<D0, W, Acc, D1>(initialValue, fold, fin)(zset), ring.one]]))
  )

/**
 * @pointfree
 */
export const aggregateInternal = <Data, W, Acc, Res>(
  initialValue: Acc,
  fold: (acc: Acc, value: W, key: Data) => Acc,
  fin: (x: Acc) => Res
) =>
(self: HM.HashMap<Data, W>) =>
  pipe(
    HM.reduce(initialValue, fold)(self),
    fin
  )
