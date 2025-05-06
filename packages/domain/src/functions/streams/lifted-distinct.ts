import { pipe } from "effect"
import type { Ring } from "../../objs/ring.js"
import { unaryLift } from "../i-z-set/lift.js"
import { distinct as innerDistinct } from "../i-z-set/unary/distinct.js"

export const distinct = <K, D, W>(ring: Ring<W>) =>
  pipe(
    innerDistinct<K, D, W>(ring),
    unaryLift
  )
