import { HashMap as HM, Option, pipe } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import type { Ring } from "../../../objs/ring.js"
import { merge } from "../../hashmap/merge.js"
import { mapInternal } from "../abstractions/map-internal.js"
import { distinctInternal } from "../unary/distinct.js"

/**
 * @returns elements in self but not in other.
 */
export const except =
  <Key, Data, W>(ring: Ring<W>) => (other: IZSet<Key, Data, W>) => (self: IZSet<Key, Data, W>): IZSet<Key, Data, W> => {
    const mergeFn = merge<HM.HashMap<Data, W>, HM.HashMap<Data, W>, HM.HashMap<Data, W>, Key, Key>((a, b) =>
      Option.match(a, {
        onSome: (a) =>
          Option.match(b, {
            onSome: (b) => exceptInternal<Data, W>(ring)(a)(b),
            onNone: () => a // if there is no b I should just return a, this makes sense to me.
          }),
        onNone: () => HM.empty<Data, W>()
      })
    )

    return pipe(
      self,
      mapInternal((self) => mergeFn(self)(other.index))
    )
  }

export const exceptInternal =
  <Data, W>(ring: Ring<W>) => (other: HM.HashMap<Data, W>) => (self: HM.HashMap<Data, W>): HM.HashMap<Data, W> => {
    console.log("start")
    const result = HM.beginMutation(HM.empty<Data, W>())

    const selfDistinct = distinctInternal(ring)(self)
    const otherDistinct = distinctInternal(ring)(other)
    console.log("self distinct", selfDistinct)
    console.log("other distinct", otherDistinct)
    HM.forEach(selfDistinct, (w, data) => {
      if (ring.leq(Option.getOrElse(HM.get(otherDistinct, data), () => ring.zero), ring.zero)) {
        console.log("data hit", data)
        HM.set(result, data, ring.one)
      }
    })
    console.log("res", result)
    return HM.endMutation(result)
  }
