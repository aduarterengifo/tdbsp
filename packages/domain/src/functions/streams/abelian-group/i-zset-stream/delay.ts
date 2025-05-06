import { IZSetAG } from "../../../../objs/abelian-groups/i-z-set.js"
import type { Ring } from "../../../../objs/ring.js"
import { aGDelayOp } from "../delay.js"

/**
 * Produces an output stream by delaying its input stream by one step.
 */
export const iZSetDelayOp = <K, D, W>(ring: Ring<W>) => aGDelayOp(IZSetAG<K, D, W>(ring))
