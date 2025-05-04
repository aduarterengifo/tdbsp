import { HashMap as HM, Option, pipe } from "effect"
import { beginMutation } from "effect/HashMap"
import type { IZSet } from "../../../objs/i-z-set.js"
import type { Ring } from "../../../objs/ring.js"
import { merge } from "../../hashmap/merge.js"
import { make } from "../make.js"
import { mapInternal } from "../unary/leak/map-internal.js"

export const union = <Key, Data, W>(that: IZSet<Key, Data, W>) => (self: IZSet<Key, Data, W>): IZSet<Key, Data, W> =>
  pipe(
    self,
    mapInternal((selfMap) => HM.reduce(selfMap, that.index, (thatMap, value, key) => HM.set(thatMap, key, value)))
  )

/**
 * how do I add two iZSet together?
 * naturally I the indexes get combined
 * we add just the weights
 * if i know how to do *algebra* on z-set then I just match them by their indexes and do *algebra* there.
 */
// export const add = <Key, Data, W>(other: IZSet<Key, Data, W>) => (self: IZSet<Key, Data, W>) => {
//   const result = make<Key, Data, W>()

//   HashMap.union(other.index, self.index)

//   // get union of their keys.
//   const unionKeys = new Set([...HashMap.keys(self.index), ...HashMap.keys(other.index)])

//   for (const key of unionKeys) {
//     // add the elements
//     const getter = getZsetOrEmpty<Key, Data, W>(key)
//     const innerKeysUnion = new Set([...HashMap.keys(getter(self)), ...HashMap.keys(getter(other))])

//     for (const data of innerKeysUnion) {
//       const getWeight(key, data)
//     }
//   }
// }

export const add = <Key, Data, W>(ring: Ring<W>) => (other: IZSet<Key, Data, W>) => (self: IZSet<Key, Data, W>) => {
  // gotta do the annoying matching bs
  // how to match the indexes together and add them
  // I have to lists basically [[K1,-],[K2,-], [K3,-]]
  // and [[K4,-],[K5,-], [K6,-]]
  // the problem is in matching the

  const result = make<Key, Data, W>()

  // merge takes two and returns one.
  const mergeFn = merge<HM.HashMap<Data, W>, HM.HashMap<Data, W>, HM.HashMap<Data, W>>((a, b) =>
    Option.match(a, {
      onSome: (a) =>
        Option.match(b, {
          onSome: (b) => addInternal(ring)(a)(b),
          onNone: () => a
        }),
      onNone: () => b
    })
  )

  // fn from map to map.
  const t = mapInternal

  const union = new Set([...HM.keys(self.index), ...HM.keys(other.index)])
  union.forEach((key) => {
    const [a, b] = [self, other].map((x) => HM.get(x.index, key))

    Option.match(a, {
      onSome: (a) =>
        Option.match(b, {
          onSome: (b) => addInternal(ring)(a)(b),
          onNone: () => a
        }),
      onNone: () => b
    })
  })
}

export const addInternal = <Data, W>(ring: Ring<W>) => (other: HM.HashMap<Data, W>) => (self: HM.HashMap<Data, W>) => {
  let result: HM.HashMap<Data, W> = beginMutation(self)
  HM.forEach(
    other,
    (v, k) => {
      result = HM.modifyAt<Data, W>(result, k, (existingValue) => {
        const sum = ring.add(Option.getOrElse(existingValue, () => ring.zero), v)
        return sum !== 0 ? Option.some(sum) : Option.none()
      })
    }
  )

  return result
}
