import type { IZSet } from "../../objs/i-z-set.js"
import type { Ring } from "../../objs/ring.js"
import { unaryLift } from "../i-z-set/lift.js"
import { distinct as innerDistinct } from "../i-z-set/unary/distinct.js"

export const distinct = <K, D, W>(ring: Ring<W>) =>
  unaryLift((zset: IZSet<K, D, W>) => innerDistinct<K, D, W>(ring)(zset))
