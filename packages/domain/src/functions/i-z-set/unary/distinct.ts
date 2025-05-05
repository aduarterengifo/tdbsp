import { HashMap } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { distinct as hashMapDistinct } from "../../hashmap/unary/distinct.js"
import { mapInternal } from "../abstractions/map-internal.js"

/**
 * @pointfree
 */
export const distinct = <Key, Data, W>(ring: Ring<W>) =>
  mapInternal<Key, Data, Data, W>(
    HashMap.map(
      hashMapDistinct<Data, W>(ring)
    )
  )
