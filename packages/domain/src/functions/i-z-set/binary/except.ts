import { HashMap as HM, Option, pipe } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import type { Ring } from "../../../objs/ring.js"
import { merge } from "../../hashmap/merge.js"
import { mapInternal } from "../abstractions/map-internal.js"
import { distinctInternal } from "../unary/distinct.js"

/**
 * @returns elements in self but not in other.
 */
export const except = <Key, Data, W>(ring: Ring<W>) => (other: IZSet<Key, Data, W>) => {
  const mergeFn = merge<HM.HashMap<Data, W>, HM.HashMap<Data, W>, HM.HashMap<Data, W>, Key, Key>(
    (selfVal, otherVal) => {
      return Option.match(selfVal, {
        onSome: (selfVal) =>
          Option.match(otherVal, {
            onSome: (otherVal) => exceptInternal<Data, W>(ring)(otherVal)(selfVal),
            onNone: () => selfVal
          }),
        onNone: () => HM.empty<Data, W>()
      })
    }
  )

  return pipe(
    mergeFn(other.index),
    mapInternal
  )
}

export const exceptInternal =
  <Data, W>(ring: Ring<W>) => (other: HM.HashMap<Data, W>) => (self: HM.HashMap<Data, W>): HM.HashMap<Data, W> => {
    const result = HM.beginMutation(HM.empty<Data, W>())

    const selfDistinct = distinctInternal(ring)(self)
    const otherDistinct = distinctInternal(ring)(other)

    HM.forEach(selfDistinct, (w, data) => {
      if (ring.leq(Option.getOrElse(HM.get(otherDistinct, data), () => ring.zero), ring.zero)) {
        HM.set(result, data, ring.one)
      }
    })
    return HM.endMutation(result)
  }
