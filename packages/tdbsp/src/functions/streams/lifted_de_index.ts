import { pipe } from "effect"
import { unaryLift } from "../i_z_set/lift.js"
import { deindex as innerDeIndex } from "../i_z_set/unary/deindex.js"

export const deindex = <K, D0, W>() =>
  pipe(
    innerDeIndex<K, D0, W>(),
    unaryLift
  )
