import { pipe } from "effect"
import { setInner } from "../../../hashmap/unary/set_inner.js"
import { mapInternal } from "../../abstractions/map_internal.js"

/**
 * @immutable
 * @leaks
 */
export const setData = <Key, Data, W>(key: Key, data: Data, w: W) =>
  pipe(
    setInner<Key, Data, W>(key, data, w),
    mapInternal<Key, Key, Data, Data, W>
  )
