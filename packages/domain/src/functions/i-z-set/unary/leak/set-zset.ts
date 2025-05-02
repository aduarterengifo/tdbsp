import { HashMap } from "effect"
import type { IZSet } from "../../../../objs/i-z-set.js"
import { make } from "../../make.js"

/**
 * @immutable
 * @leaks
 */
export const setZset = <Key, Data, W>(key: Key, zset: HashMap.HashMap<Data, W>) => (self: IZSet<Key, Data, W>) =>
  make<Key, Data, W>(HashMap.set(self.index, key, zset))
