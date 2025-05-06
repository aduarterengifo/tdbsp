import { HashMap as HM, Option, pipe } from "effect"
import { beginMutation, endMutation } from "effect/HashMap"
import type { IZSet } from "../../../objs/i-z-set.js"
import type { Ring } from "../../../objs/ring.js"
import { merge } from "../../hashmap/merge.js"
import { mapInternal } from "../abstractions/map-internal.js"

export const mul =
  <K, D, W>(ring: Ring<W>) =>
  (fn: (x: D, y: D) => D) =>
  (other: IZSet<K, D, W>) =>
  (self: IZSet<K, D, W>): IZSet<K, D, W> => {
    const mergeFn = merge<HM.HashMap<D, W>, HM.HashMap<D, W>, HM.HashMap<D, W>, K, K>((a, b) =>
      Option.match(a, {
        onSome: (a) =>
          Option.match(b, {
            onSome: (b) => mulInternal<D, D, D, W>(ring)(fn)(a)(b),
            onNone: () => a
          }),
        onNone: () => Option.getOrElse(b, () => HM.empty<D, W>())
      })
    )

    return pipe(
      self,
      mapInternal<K, K, D, D, W>((self) => mergeFn(self)(other.index))
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

    HM.forEach(self, (valueA, keyA) => {
      HM.forEach(other, (valueB, keyB) => {
        HM.set(result, fn(keyA, keyB), ring.mul(valueA, valueB))
      })
    })

    return endMutation(result)
  }
