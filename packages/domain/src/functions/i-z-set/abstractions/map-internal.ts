import type { HashMap as HM } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import { make } from "../make.js"

/**
 * core abstraction
 * returns a z-set with the function applied to the underlying hashmap.
 */
export const mapInternal =
  <K, D0, D1, W0>(f: (map: HM.HashMap<K, HM.HashMap<D0, W0>>) => HM.HashMap<K, HM.HashMap<D1, W0>>) =>
  (iZSet: IZSet<K, D0, W0>) => make<K, D1, W0>(f(iZSet.index))
