import { HashMap as HM } from "effect"
import type { IZSet } from "../../../../objs/i-z-set.js"

/**
 * @predicate
 */
export const isEmpty = <Key, Data, W>(self: IZSet<Key, Data, W>) => HM.isEmpty(self.index)
