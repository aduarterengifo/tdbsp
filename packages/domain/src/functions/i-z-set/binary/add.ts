import { HashMap as HM, Option, pipe } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import type { Ring } from "../../../objs/ring.js"
import { mergeInternal } from "../../hashmap/merge-alt.js"
import { merge } from "../../hashmap/merge.js"
import { mapInternal } from "../unary/leak/map-internal.js"

export const add =
  <Key, Data, W>(ring: Ring<W>) => (other: IZSet<Key, Data, W>) => (self: IZSet<Key, Data, W>): IZSet<Key, Data, W> => {
    // merge takes two and returns one.
    // NEED an extra cleanup check for empty data
    const mergeFn = merge<HM.HashMap<Data, W>, HM.HashMap<Data, W>, HM.HashMap<Data, W>, Key, Key>((a, b) =>
      Option.match(a, {
        onSome: (a) =>
          Option.match(b, {
            onSome: (b) => addInternal<Data, W>(ring)(a)(b),
            onNone: () => a
          }),
        onNone: () => Option.getOrElse(b, () => HM.empty<Data, W>())
      })
    )

    return pipe(
      self,
      mapInternal((self) => mergeFn(self)(other.index))
    )
  }

/**
 * @immutable
 * handles zero-sum elimination
 */
export const addInternal = <Data, W>(ring: Ring<W>) => {
  const mergeFn = (existingValue: Option.Option<W>, newValue: W) => {
    const res = ring.add(Option.getOrElse(existingValue, () => ring.zero), newValue)
    return res !== 0 ? Option.some(res) : Option.none()
  }

  return mergeInternal<Data, Data, W, W>(mergeFn)
}
