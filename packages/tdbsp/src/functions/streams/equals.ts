import { pipe } from "effect"
import type { IZSet } from "../../objs/i_z_set.js"
import type { Ring } from "../../objs/ring.js"
import { equals as iZSetEquals } from "../i_z_set/binary/predicates/equals.js"
import { binaryLift } from "../i_z_set/lift.js"

export const equals = <Key, Data, W>(ring: Ring<W>) =>
  pipe(
    (ZSetA: IZSet<Key, Data, W>, ZSetB: IZSet<Key, Data, W>) => iZSetEquals<Key, Data, W>(ring)(ZSetA)(ZSetB),
    binaryLift
  )
