import { HashMap as HM, pipe } from "effect"
import type { IZSet } from "../../../objs/i_z_set.js"
import { getOrEmpty } from "../../hashmap/unary/get_or_empty.js"
import { mapInternal } from "../abstractions/map_internal.js"

export const flatten = <K, D0, D1, W>(fn: (k: K, d: D0) => D1): (iZSet: IZSet<K, D0, W>) => IZSet<0, D1, W> =>
  pipe(
    HM.reduce<HM.HashMap<0, HM.HashMap<D1, W>>, HM.HashMap<D0, W>, K>(
      HM.empty<0, HM.HashMap<D1, W>>(),
      (outerAcc, val, key) =>
        HM.reduce<HM.HashMap<0, HM.HashMap<D1, W>>, W, D0>(
          outerAcc,
          (acc, w, data) =>
            HM.set<0, HM.HashMap<D1, W>>(
              0,
              HM.set(
                fn(key, data),
                w
              )(getOrEmpty<0, D1, W>(0)(acc))
            )(acc)
        )(val)
    ),
    mapInternal<K, 0, D0, D1, W>
  )
