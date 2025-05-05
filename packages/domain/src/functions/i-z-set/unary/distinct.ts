import { HashMap, Option } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { mapInternal } from "../abstractions/map-internal.js"

/**
 * @pointfree
 */
export const distinct = <Key, Data, W>(ring: Ring<W>) =>
  mapInternal<Key, Data, Data, W>(
    HashMap.map(
      distinctInternal<Data, W>(ring)
    )
  )

/**
 * @pointfree
 */
export const distinctInternal = <Data, W>(ring: Ring<W>) =>
  HashMap.filterMap<W, Data, W>((w, _) =>
    ring.leq(ring.zero, w) && w !== ring.zero ? Option.some(ring.one) : Option.none()
  )
