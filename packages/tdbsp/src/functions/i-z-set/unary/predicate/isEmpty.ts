import { HashMap as HM } from "effect"
import type { IZSet } from "../../../../objs/i-z-set.js"

/**
 * @predicate
 * if all keys of the IZet point to empty Zset we also consider the IZet empty.
 */
export const isEmpty = <Key, Data, W>(self: IZSet<Key, Data, W>) =>
  HM.isEmpty(self.index) || HM.every(self.index, (x) => HM.isEmpty(x))
