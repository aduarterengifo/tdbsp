import { HashMap as HM, Option } from "effect"
import type { Ring } from "../../../objs/ring.js"

/**
 * @pointfree
 */
export const distinct = <Data, W>(ring: Ring<W>) =>
  HM.filterMap<W, Data, W>((w, _) => ring.leq(ring.zero, w) && w !== ring.zero ? Option.some(ring.one) : Option.none())
