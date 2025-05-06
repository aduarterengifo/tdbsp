import { HashMap as HM, pipe } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { deepMapInternal } from "../abstractions/deep-map-internal.js"

/**
 * @pointfree
 */
export const aggregate = <Key, D0, W, Acc, D1>(ring: Ring<W>) =>
(
  initialValue: Acc,
  fold: (acc: Acc, w: W, data: D0) => Acc,
  fin: (x: Acc) => D1
) =>
  pipe(
    (self) =>
      HM.fromIterable([[
        pipe(
          self,
          HM.reduce(initialValue, fold),
          fin
        ),
        ring.one
      ]]),
    deepMapInternal<Key, D0, D1, W>
  )
