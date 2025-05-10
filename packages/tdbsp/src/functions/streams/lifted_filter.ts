import { pipe } from "effect"
import { unaryLift } from "../i_z_set/lift.js"
import { filter as innerFilter } from "../i_z_set/unary/filter.js"

export const filter = <K, D, W>(predicate: (w: W, data: D) => boolean) =>
  pipe(
    innerFilter<K, D, W>(predicate),
    unaryLift
  )
