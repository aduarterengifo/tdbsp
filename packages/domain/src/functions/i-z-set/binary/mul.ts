import { HashMap as HM, Option, pipe } from "effect"
import { beginMutation, endMutation } from "effect/HashMap"
import type { IZSet } from "../../../objs/i-z-set.js"
import type { Ring } from "../../../objs/ring.js"
import { merge } from "../../hashmap/merge.js"
import { mapInternal } from "../unary/leak/map-internal.js"

export const mul =
  <Key, Data, W>(ring: Ring<W>) =>
  (fn: (x: Data, y: Data) => Data) =>
  (other: IZSet<Key, Data, W>) =>
  (self: IZSet<Key, Data, W>): IZSet<Key, Data, W> => {
    const mergeFn = merge<HM.HashMap<Data, W>, HM.HashMap<Data, W>, HM.HashMap<Data, W>, Key, Key>((a, b) =>
      Option.match(a, {
        onSome: (a) =>
          Option.match(b, {
            onSome: (b) => mulInternal<Data, Data, Data, W>(ring)(fn)(a)(b),
            onNone: () => a
          }),
        onNone: () => Option.getOrElse(b, () => HM.empty<Data, W>())
      })
    )

    return pipe(
      self,
      mapInternal((self) => mergeFn(other.index)(self))
    )
  }

/**
 * @immutable
 * does secret hush hush lightweight mutations.
 */
export const mulInternal =
  <D0, D1, D2, W0>(ring: Ring<W0>) =>
  (fn: (x: D0, y: D1) => D2) =>
  (other: HM.HashMap<D1, W0>) =>
  (
    self: HM.HashMap<D0, W0>
  ): HM.HashMap<D2, W0> => {
    const result = beginMutation(HM.empty<D2, W0>())

    HM.forEach(self, (valueA, keyA) => { // one here
      HM.forEach(other, (valueB, keyB) => { // one  here
        HM.set(result, fn(keyA, keyB), ring.mul(valueA, valueB))
      })
    })

    return endMutation(result)
  }
