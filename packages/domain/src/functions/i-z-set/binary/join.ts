import type { HashMap as HM } from "effect"
import { pipe } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import type { Ring } from "../../../objs/ring.js"
import { mergePerfect } from "../../hashmap/merge.js"
import { mapInternal } from "../abstractions/map-internal.js"
import { mulInternal } from "./mul.js"

export const join =
  <Key, Data, W>(ring: Ring<W>) =>
  (fn: (x: Data, y: Data) => Data) =>
  (other: IZSet<Key, Data, W>) =>
  (self: IZSet<Key, Data, W>): IZSet<Key, Data, W> =>
    pipe(
      self,
      mapInternal((self) =>
        pipe(
          mulInternal<Data, Data, Data, W>(ring)(fn),
          mergePerfect<HM.HashMap<Data, W>, HM.HashMap<Data, W>, HM.HashMap<Data, W>, Key, Key>
        )(other.index)(self)
      )
    )
