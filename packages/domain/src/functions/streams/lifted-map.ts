import { pipe } from "effect"
import { unaryLift } from "../i-z-set/lift.js"
import { map as innerMap } from "../i-z-set/unary/map.js"

export const map = <K, D0, D1, W>() =>
  pipe(
    innerMap<K, D0, D1, W>,
    unaryLift
  )
