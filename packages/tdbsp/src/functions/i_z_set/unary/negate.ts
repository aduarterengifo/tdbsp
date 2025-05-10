import { HashMap, Option, pipe } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { deepMapInternal } from "../abstractions/deep_map_internal.js"

/**
 * @pointfree
 */
export const negate = <Key, Data, W>(ring: Ring<W>) =>
  pipe(
    HashMap.filterMap((w, _) => Option.some(ring.sub(ring.zero, w))),
    deepMapInternal<Key, Data, Data, W>
  )
