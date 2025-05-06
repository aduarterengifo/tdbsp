import type { IZSet } from "../../objs/i-z-set.js"
import type { Ring } from "../../objs/ring.js"
import { equals as iZSetEquals } from "../i-z-set/binary/predicates/equals.js"
import { binaryLift } from "../i-z-set/lift.js"

export const equals = <Key, Data, W>(ring: Ring<W>) =>
  binaryLift(
    (ZSetA: IZSet<Key, Data, W>, ZSetB: IZSet<Key, Data, W>) => iZSetEquals<Key, Data, W>(ring)(ZSetA)(ZSetB)
  )
