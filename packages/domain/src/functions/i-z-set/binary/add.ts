import { HashMap, Option } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import { make } from "../make.js"
import { getWeight } from "../unary/leak/get-weight.js"
import { getZset, getZsetOrEmpty } from "../unary/leak/get-zset.js"

/**
 * how do I add two iZSet together?
 * naturally I the indexes get combined
 * we add just the weights
 * if i know how to do *algebra* on z-set then I just match them by their indexes and do *algebra* there.
 */
export const add = <Key, Data, W>(other: IZSet<Key, Data, W>) => (self: IZSet<Key, Data, W>) => {
  const result = make<Key, Data, W>()

  HashMap.union(other.index, self.index)

  // get union of their keys.
  const unionKeys = new Set([...HashMap.keys(self.index), ...HashMap.keys(other.index)])

  for (const key of unionKeys) {
    // add the elements
    const getter = getZsetOrEmpty<Key, Data, W>(key)
    const innerKeysUnion = new Set([...HashMap.keys(getter(self)), ...HashMap.keys(getter(other))])

    for (const data of innerKeysUnion) {
      const getWeight(key, data)
    }
  }
}
