import { HashMap, Option, pipe } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { deepMapInternal } from "../abstractions/deep_map_internal.js"

/**
 * @pointfree
 */
export const positive = <Key, Data, W>(ring: Ring<W>) =>
  pipe(
    HashMap.filterMap((w, _) => ring.leq(ring.zero, w) && w !== ring.zero ? Option.some(w) : Option.none()),
    deepMapInternal<Key, Data, Data, W>
  )
