import { HashMap, Option } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import type { Ring } from "../../../objs/ring.js"
import { make } from "../make.js"

// its not really that abstract though is it? I am still hardcoding z-sets here

export const distinct = <Key, Data, W>(ring: Ring<W>) => (self: IZSet<Key, Data, W>) =>
  make<Key, Data, W>(
    HashMap.map<HashMap.HashMap<Data, W>, HashMap.HashMap<Data, W>, Key>((zset, _) =>
      distinctInternal<Data, W>(ring)(zset)
    )(self.index)
  )

/**
 * point-free distinctInternal
 */
export const distinctInternal = <Data, W>(ring: Ring<W>) =>
  HashMap.filterMap<W, Data, W>((w, _) =>
    ring.leq(ring.zero, w) && w !== ring.zero ? Option.some(ring.one) : Option.none()
  )
