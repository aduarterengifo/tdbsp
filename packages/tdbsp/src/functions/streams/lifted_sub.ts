import { pipe } from "effect"
import type { IZSet } from "../../objs/i_z_set.js"
import type { Ring } from "../../objs/ring.js"
import { sub as innerSub } from "../i_z_set/binary/sub.js"
import { binaryLift } from "../i_z_set/lift.js"

export const sub = <Key, Data, W>(ring: Ring<W>) =>
  pipe(
    (ZSetA: IZSet<Key, Data, W>, ZSetB: IZSet<Key, Data, W>): IZSet<Key, Data, W> =>
      innerSub<Key, Data, W>(ring)([ZSetA, ZSetB]),
    binaryLift
  )
