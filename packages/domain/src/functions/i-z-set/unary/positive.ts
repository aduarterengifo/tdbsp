import { HashMap, Option } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { mapInternal } from "../abstractions/map-internal.js"

/**
 * @pointfree
 */
export const positive = <Key, Data, W>(ring: Ring<W>) =>
  mapInternal<Key, Data, Data, W>(
    HashMap.map(
      positiveInternal<Data, W>(ring)
    )
  )

/**
 * @pointfree
 */
export const positiveInternal = <Data, W>(ring: Ring<W>) =>
  HashMap.filterMap<W, Data, W>((w, _) => ring.leq(ring.zero, w) && w !== ring.zero ? Option.some(w) : Option.none())
