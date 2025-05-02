import { HashMap } from "effect"
import type { IZSet } from "../../../../objs/i-z-set.js"
import { make } from "../../make.js"
import { getZsetOrEmpty } from "./get-zset.js"

/**
 * @immutable
 * @leaks
 */
export const setData = <Key, Data, W>(key: Key, data: Data, w: W) => (self: IZSet<Key, Data, W>) => {
  make<Key, Data, W>(
    HashMap.set(
      self.index,
      key,
      HashMap.set(
        getZsetOrEmpty<Key, Data, W>(key)(self),
        data,
        w
      )
    )
  )
}
