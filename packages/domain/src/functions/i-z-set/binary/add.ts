import { Option } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { foldOptional } from "../../hashmap/n-ary/fold.js"
import { fold } from "../abstractions/deep-fold-internal.js"

export const add = <Key, Data, W>(ring: Ring<W>) =>
  fold<Key, Data, W>(
    foldOptional((a, b) => {
      const res = ring.add(Option.getOrElse(a, () => ring.zero), Option.getOrElse(b, () => ring.zero))
      return res !== 0 ? Option.some(res) : Option.none()
    })
  )
