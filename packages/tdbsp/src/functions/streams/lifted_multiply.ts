import { pipe } from "effect"
import type { IZSet } from "../../objs/i_z_set.js"
import type { Ring } from "../../objs/ring.js"
import { mul as innerMul } from "../i_z_set/binary/mul.js"
import { binaryLift } from "../i_z_set/lift.js"

export const mul = <Key, Data, W>(ring: Ring<W>) => (fn: (a: Data, b: Data) => Data) =>
  pipe(
    (ZSetA: IZSet<Key, Data, W>, ZSetB: IZSet<Key, Data, W>): IZSet<Key, Data, W> =>
      innerMul<Key, Data, W>(ring)(fn)(ZSetB)(ZSetA),
    binaryLift
  )
