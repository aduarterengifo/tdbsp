import { pipe } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import type { Ring } from "../../../objs/ring.js"
import { h as iZSetH } from "../../i-z-set/binary/h.js"
import { binaryLift } from "../../i-z-set/lift.js"

export const h = <Key, Data, W>(ring: Ring<W>) =>
  pipe(
    (ZSetA: IZSet<Key, Data, W>, ZSetB: IZSet<Key, Data, W>): IZSet<Key, Data, W> =>
      iZSetH<Key, Data, W>(ring)(ZSetB)(ZSetA),
    binaryLift
  )
