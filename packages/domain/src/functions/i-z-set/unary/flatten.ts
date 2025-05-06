import { HashMap as HM, pipe } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import { fold } from "../../hashmap/n-ary/fold.js"
import { foldOptional } from "../abstractions/deep-fold-internal.js"
import { mapInternal } from "../abstractions/map-internal.js"
import { mergeOptional } from "../abstractions/merge.js"

export const flatten = <K, D0, D1, W>(fn: (k: K, d: D0) => D1) => (self: IZSet<K, D0, W>) => {
  //   const t = pipe(
  //     (self: HM.HashMap<K, HM.HashMap<D0, W>>) => {
  //         fold<D,V>(f:())
  //     },
  //     mapInternal<K, D0, D1, W> // apply f on the index of self.
  //   )
  const t = HM.empty<0, HM.HashMap<D1, W>>()

  mergeOptional((selfVal, thatVal) => {})
}
