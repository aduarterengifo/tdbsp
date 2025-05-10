import { HashMap as HM } from "effect"
import type { IZSet, ZSet } from "../../../objs/i_z_set.js"
import { setInner } from "../../hashmap/unary/set_inner.js"
import { make } from "../make.js"
import { getZsetOrEmpty } from "./leak/get_zset.js"

// this is still well-defined for IZSet, nothing breaks if you pass in a Zset so
export const index = <K, D, W>(fn: (x: D) => K) => (self: ZSet<D, W>): IZSet<K, D, W> =>
  make<K, D, W>(
    HM.reduce<HM.HashMap<K, HM.HashMap<D, W>>, W, D>(
      HM.empty<K, HM.HashMap<D, W>>(),
      (acc, w, data) => setInner(fn(data), data, w)(acc)
    )(getZsetOrEmpty<0, D, W>(0)(self))
  )
