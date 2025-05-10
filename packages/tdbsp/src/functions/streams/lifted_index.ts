import { pipe } from "effect"
import { unaryLift } from "../i_z_set/lift.js"
import { index as innerIndex } from "../i_z_set/unary/index.js"

export const index = <K, D, W>(f: (d: D) => K) =>
  pipe(
    innerIndex<K, D, W>(f),
    unaryLift
  )
