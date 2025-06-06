import type { HashMap as HM } from "effect"
import type { IZSet } from "../../../objs/i_z_set.js"
// No need for `make` here as we aren't constructing a new IZSet

/**
 * operates on internal hashmap structure
 */
export const foldInternal =
  <K, D, W, R>(f: (map: HM.HashMap<K, HM.HashMap<D, W>>) => R) => (iZSet: IZSet<K, D, W>): R => f(iZSet.index)
