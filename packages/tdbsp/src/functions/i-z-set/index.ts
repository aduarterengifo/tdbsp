import { HashMap as HM } from "effect"
import type { ZSet } from "../../objs/i-z-set.js"
import { setInner } from "../hashmap/unary/set-inner.js"
import { make } from "./make.js"
import { getZsetOrEmpty } from "./unary/leak/get-zset.js"

export const index = <K, D, W>(fn: (x: D) => K) => (self: ZSet<D, W>) =>
  make<K, D, W>(
    HM.reduce<HM.HashMap<K, HM.HashMap<D, W>>, W, D>(
      HM.empty<K, HM.HashMap<D, W>>(),
      (acc, w, data) => setInner(fn(data), data, w)(acc)
    )(getZsetOrEmpty<0, D, W>(0)(self))
  )
