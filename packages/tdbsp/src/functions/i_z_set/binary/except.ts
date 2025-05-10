import type { HashMap as HM } from "effect"
import { Option, pipe } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { zeroToNone } from "../../../objs/utils/ring.js"
import { foldOptional } from "../../hashmap/n_ary/fold.js"
import { distinct } from "../../hashmap/unary/distinct.js"
import { fold } from "../abstractions/deep_fold_internal.js"

/**
 * @returns elements in self but not in other.
 */
export const except = <Key, Data, W>(ring: Ring<W>) =>
  fold<Key, Data, W>(
    (a: HM.HashMap<Data, W>, b: HM.HashMap<Data, W>) =>
      foldOptional<Data, W>((a, b) =>
        pipe(
          Option.match(a, {
            onSome: () => ring.zero,
            onNone: () => b
          }),
          zeroToNone<W>(ring)
        )
      )([a, b].map(distinct(ring)))
  )
