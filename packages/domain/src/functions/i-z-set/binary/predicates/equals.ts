import { type HashMap as HM, pipe } from "effect"
import type { IZSet } from "../../../../objs/i-z-set.js"
import { isEmpty } from "../../unary/predicate/isEmpty.js"
import { substract } from "../substract.js"

/**
 * @predicate
 */
export const equals =
  <Key, Data, W>(ring: Ring<W>) => <Key, Data, W>(other: IZSet<Key, Data, W>) => (self: IZSet<Key, Data, W>) => {
    pipe(self, substract(ring)(other), isEmpty)
    substract(ring)(other)(self)
  }
