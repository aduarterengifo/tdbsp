import { pipe } from "effect"
import type { IZSet } from "../../../objs/i_z_set.js"
import type { Ring } from "../../../objs/ring.js"
import { h as iZSetH } from "../../i_z_set/binary/h.js"
import { binaryLift } from "../../i_z_set/lift.js"

export const h = <Key, Data, W>(ring: Ring<W>) =>
  pipe(
    (ZSetA: IZSet<Key, Data, W>, ZSetB: IZSet<Key, Data, W>): IZSet<Key, Data, W> =>
      iZSetH<Key, Data, W>(ring)(ZSetB)(ZSetA),
    binaryLift
  )
