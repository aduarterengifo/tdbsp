import { HashMap, Option } from "effect"
import type { IZSet } from "../../../../objs/i_z_set.js"
import { getZset } from "./get_zset.js"

/**
 * @leaks
 * it doesn't really make sense to want to have the data for any keys, because you could get duplicates, which is much more niche?
 */
export const getWeight = <Key, Data, W>(key: Key, data: Data) => (self: IZSet<Key, Data, W>) =>
  getZset<Key, Data, W>(key)(self).pipe(Option.flatMap((zset) => HashMap.get(zset, data)))
