import { add } from "../../functions/i_z_set/binary/add.js"
import { sub } from "../../functions/i_z_set/binary/sub.js"
import { make } from "../../functions/i_z_set/make.js"
import type { IZSet } from "../i_z_set.js"
import type { Ring } from "../ring.js"

export const IZSetAG = <K, D, W>(ring: Ring<W>) => ({
  add: (x: IZSet<K, D, W>, y: IZSet<K, D, W>) => add<K, D, W>(ring)([x, y]),
  sub: (x: IZSet<K, D, W>, y: IZSet<K, D, W>) => sub<K, D, W>(ring)([x, y]),
  zero: make<K, D, W>()
})
