import { HashMap } from "effect"
import type { IZSet } from "../../objs/i_z_set.js"
import type { Ring } from "../../objs/ring.js"
import { randomElem } from "../utils/random.js"
import { add } from "./binary/add.js"
import { make } from "./make.js"

export const randomGen =
  <K, D, W>(ring: Ring<W>) =>
  (source: IZSet<K, D, W>) =>
  (self: IZSet<K, D, W>): { newZSet: IZSet<K, D, W>; changeInstance: IZSet<K, D, W> } => {
    // for each index, pick a random row from z-set
    const key = randomElem(Array.from(HashMap.keys(source.index)))
    const zset = HashMap.unsafeGet(key)(source.index)
    const d = randomElem(Array.from(HashMap.keys(zset)))
    const w = Math.random() < 0.5 ? ring.one : ring.sub(ring.zero, ring.one)

    const izset = make<K, D, W>(HashMap.fromIterable([[key, HashMap.fromIterable([[d, w]])]]))

    return ({
      newZSet: add<K, D, W>(ring)([self, izset]),
      changeInstance: izset
    })
  }
