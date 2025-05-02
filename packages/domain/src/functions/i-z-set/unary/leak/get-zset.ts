import { HashMap, Option } from "effect"
import type { IZSet } from "../../../../objs/i-z-set.js"

/**
 * @leaks
 */
export const getZset = <Key, Data, W>(key: Key) => (self: IZSet<Key, Data, W>) => HashMap.get(self.index, key)

export const getZsetOrEmpty = <Key, Data, W>(key: Key) => (self: IZSet<Key, Data, W>) =>
  Option.getOrElse(getZset<Key, Data, W>(key)(self), () => HashMap.empty<Data, W>())
