import { pipe } from "effect"
import { unaryLift } from "../i-z-set/lift.js"
import { deindex as innerDeIndex } from "../i-z-set/unary/deindex.js"

export const deindex = <K, D0, W>() =>
  pipe(
    innerDeIndex<K, D0, W>(),
    unaryLift
  )
