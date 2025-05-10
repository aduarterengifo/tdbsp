import { pipe } from "effect"
import type { Ring } from "../../objs/ring.js"
import { unaryLift } from "../i_z_set/lift.js"
import { distinct as innerDistinct } from "../i_z_set/unary/distinct.js"

export const distinct = <K, D, W>(ring: Ring<W>) =>
  pipe(
    innerDistinct<K, D, W>(ring),
    unaryLift
  )
