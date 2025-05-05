import { type HashMap as HM, pipe } from "effect"
import type { IZSet } from "../../../../objs/i-z-set.js"
import type { Ring } from "../../../../objs/ring.js"
import { isEmpty } from "../../unary/predicate/isEmpty.js"
import { sub } from "../sub.js"

/**
 * @predicate
 */
export const equals = <Key, Data, W>(ring: Ring<W>) => (other: IZSet<Key, Data, W>) => (self: IZSet<Key, Data, W>) =>
  pipe([self, other], sub(ring), isEmpty)
