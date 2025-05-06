import type { HashMap as HM } from "effect"
import { pipe } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import type { Ring } from "../../../objs/ring.js"
import { mergePerfect } from "../../hashmap/merge.js"
import { mapInternal } from "../abstractions/map-internal.js"
import { mulInternal } from "./mul.js"

export const join =
  <K, D0, D1, D2, W>(ring: Ring<W>) =>
  (fn: (x: D0, y: D1) => D2) =>
  (other: IZSet<K, D1, W>) =>
  (self: IZSet<K, D0, W>): IZSet<K, D2, W> =>
    pipe(
      self,
      mapInternal<K, K, D0, D2, W>((self) =>
        pipe(
          mulInternal<D0, D1, D2, W>(ring)(fn),
          mergePerfect<HM.HashMap<D0, W>, HM.HashMap<D1, W>, HM.HashMap<D2, W>, K, K>
        )(other.index)(self)
      )
    )
