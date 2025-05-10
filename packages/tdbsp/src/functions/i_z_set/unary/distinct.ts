import { pipe } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { distinct as hashMapDistinct } from "../../hashmap/unary/distinct.js"
import { deepMapInternal } from "../abstractions/deep_map_internal.js"

/**
 * @pointfree
 */
export const distinct = <Key, Data, W>(ring: Ring<W>) =>
  pipe(
    hashMapDistinct<Data, W>(ring),
    deepMapInternal<Key, Data, Data, W>
  )
