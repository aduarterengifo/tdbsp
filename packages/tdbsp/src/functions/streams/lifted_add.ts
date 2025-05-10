import { pipe } from "effect"
import type { IZSet } from "../../objs/i_z_set.js"
import type { Ring } from "../../objs/ring.js"
import { add as iZSetAdd } from "../i_z_set/binary/add.js"
import { binaryLift } from "../i_z_set/lift.js"

export const add = <Key, Data, W>(ring: Ring<W>) =>
  pipe(
    (ZSetA: IZSet<Key, Data, W>, ZSetB: IZSet<Key, Data, W>): IZSet<Key, Data, W> =>
      iZSetAdd<Key, Data, W>(ring)([ZSetA, ZSetB]),
    binaryLift
  )
