import { HashMap as HM } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import { make } from "../make.js"

/**
 * core abstraction
 * returns a z-set with the function applied to the underlying hashmap.
 */
export const deepMapInternal =
  <K, D0, D1, W0>(f: (map: HM.HashMap<D0, W0>, key: K) => HM.HashMap<D1, W0>) => (iZSet: IZSet<K, D0, W0>) =>
    make<K, D1, W0>(HM.map<HM.HashMap<D1, W0>, HM.HashMap<D0, W0>, K>(f)(iZSet.index))
