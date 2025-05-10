import { IZSetAG } from "../../../../objs/abelian-groups/i-z-set.js"
import type { Ring } from "../../../../objs/ring.js"
import { aGDiffOp } from "../diff.js"

/**
 * differentiation
 */
export const iZSetDiffOp = <K, D, W>(ring: Ring<W>) => aGDiffOp(IZSetAG<K, D, W>(ring))
