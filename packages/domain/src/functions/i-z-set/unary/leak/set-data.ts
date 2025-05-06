import { pipe } from "effect"
import { setInner } from "../../../hashmap/unary/set-inner.js"
import { mapInternal } from "../../abstractions/map-internal.js"

/**
 * @immutable
 * @leaks
 */
export const setData = <Key, Data, W>(key: Key, data: Data, w: W) =>
  pipe(
    setInner(key, data, w),
    mapInternal<Key, Data, Data, W>
  )
