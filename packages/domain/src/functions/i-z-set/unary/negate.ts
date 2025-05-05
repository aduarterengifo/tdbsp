import { HashMap, Option } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { mapInternal } from "../abstractions/map-internal.js"

/**
 * @pointfree
 */
export const negate = <Key, Data, W>(ring: Ring<W>) =>
  mapInternal<Key, Data, Data, W>(
    HashMap.map(
      negateInternal<Data, W>(ring)
    )
  )

/**
 * @pointfree
 */
export const negateInternal = <Data, W>(ring: Ring<W>) =>
  HashMap.filterMap<W, Data, W>((w, _) => Option.some(ring.sub(ring.zero, w))) // TODO: map should be enough
