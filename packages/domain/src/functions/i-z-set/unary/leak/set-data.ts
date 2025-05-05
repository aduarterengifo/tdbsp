import { HashMap } from "effect"
\import { getOrEmpty } from "../../../hashmap/unary/get-or-empty.js"
import { mapInternal } from "../../abstractions/map-internal.js"

/**
 * @immutable
 * @leaks
 */
export const setData = <Key, Data, W>(key: Key, data: Data, w: W) =>
  mapInternal<Key, Data, Data, W>((self) =>
    HashMap.set(
      self,
      key,
      HashMap.set(
        getOrEmpty<Key, Data, W>(key)(self),
        data,
        w
      )
    )
  )
