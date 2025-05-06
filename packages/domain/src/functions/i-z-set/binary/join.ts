import type { HashMap as HM } from "effect"
import { pipe } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import type { Ring } from "../../../objs/ring.js"
import { mergePerfect } from "../../hashmap/merge.js"
import { mapInternal } from "../abstractions/map-internal.js"
import { mulInternal } from "./mul.js"

export const join =
  <Key, D0, D1, D2, W>(ring: Ring<W>) =>
  (fn: (x: D0, y: D1) => D2) =>
  (other: IZSet<Key, D1, W>) =>
  (self: IZSet<Key, D0, W>): IZSet<Key, D2, W> =>
    pipe(
      self,
      mapInternal((self) =>
        pipe(
          mulInternal<D0, D1, D2, W>(ring)(fn),
          mergePerfect<HM.HashMap<D0, W>, HM.HashMap<D1, W>, HM.HashMap<D2, W>, Key, Key>
        )(other.index)(self)
      )
    )
