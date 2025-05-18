import { Data, HashMap } from "effect"
import type { IZSet } from "../../objs/i_z_set.js"

export const make = <Key, Data, W>(data?: HashMap.HashMap<Key, HashMap.HashMap<Data, W>>): IZSet<Key, Data, W> => {
  const index = data || HashMap.empty<Key, HashMap.HashMap<Data, W>>()

  return Data.struct({
    _tag: "IZSet" as const,
    index,
    [Symbol.iterator]() {
      return index[Symbol.iterator]()
    }
  })
}
