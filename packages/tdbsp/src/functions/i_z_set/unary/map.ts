import { HashMap as HM, pipe } from "effect"
import type { IZSet } from "../../../objs/i_z_set.js"
import { deepMapInternal } from "../abstractions/deep_map_internal.js"

/**
 * @pointfree
 */
export const map = <K, D0, D1, W>(fn: (data: D0) => D1): (iZSet: IZSet<K, D0, W>) => IZSet<K, D1, W> =>
  pipe(
    HM.reduce<HM.HashMap<D1, W>, W, D0>(
      HM.empty<D1, W>(),
      (acc, w, data) => HM.set(fn(data), w)(acc)
    ),
    deepMapInternal<K, D0, D1, W>
  )
