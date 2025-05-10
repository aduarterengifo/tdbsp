import { pipe } from "effect"
import type { IZSet } from "../../objs/i_z_set.js"
import type { Ring } from "../../objs/ring.js"
import { join as staticJoin } from "../i_z_set/binary/join.js"
import { binaryLift } from "../i_z_set/lift.js"

export const join = <Key, D0, D1, D2, W>(ring: Ring<W>) => (fn: (a: D0, b: D1) => D2) =>
  pipe(
    (self: IZSet<Key, D0, W>, other: IZSet<Key, D1, W>): IZSet<Key, D2, W> =>
      staticJoin<Key, D0, D1, D2, W>(ring)(fn)(other)(self),
    binaryLift
  )
