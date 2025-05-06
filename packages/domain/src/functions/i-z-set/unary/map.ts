import { HashMap as HM, pipe } from "effect"
import { deepMapInternal } from "../abstractions/deep-map-internal.js"

/**
 * @pointfree
 */
export const map = <Key, D0, D1, W>(fn: (data: D0) => D1) =>
  pipe(
    HM.reduce<HM.HashMap<D1, W>, W, D0>(
      HM.empty<D1, W>(),
      (acc, w, data) => HM.set(fn(data), w)(acc)
    ),
    deepMapInternal<Key, D0, D1, W>
  )
