import { IZSetAG } from "../../../../objs/abelian-groups/i_z_set.js"
import type { Ring } from "../../../../objs/ring.js"
import { aGIntOp } from "../int.js"

/**
 * integration
 */
export const iZSetIntOp = <K, D, W>(ring: Ring<W>) => aGIntOp(IZSetAG<K, D, W>(ring))
