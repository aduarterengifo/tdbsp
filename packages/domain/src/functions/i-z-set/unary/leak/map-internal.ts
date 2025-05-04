import type { HashMap as HM } from "effect"
import type { IZSet } from "../../../../objs/i-z-set.js"
import { make } from "../../make.js"

/**
 * core abstraction
 * returns a z-set with the function applied to the underlying hashmap.
 */
export const mapInternal =
  <Key, Data, W>(f: (map: HM.HashMap<Key, HM.HashMap<Data, W>>) => HM.HashMap<Key, HM.HashMap<Data, W>>) =>
  (iZSet: IZSet<Key, Data, W>) => make<Key, Data, W>(f(iZSet.index))
