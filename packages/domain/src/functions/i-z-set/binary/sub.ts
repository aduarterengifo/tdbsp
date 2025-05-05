import type { HashMap as HM } from "effect"
import { Option, pipe } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { zeroToNone } from "../../../objs/utils/ring.js"
import { foldOptional } from "../../hashmap/n-ary/fold.js"
import { fold } from "../abstractions/deep-fold-internal.js"

export const sub = <Key, Data, W>(ring: Ring<W>) =>
  fold<Key, Data, W>(
    (a: HM.HashMap<Data, W>, b: HM.HashMap<Data, W>) =>
      foldOptional<Data, W>((a, b) =>
        pipe(
          Option.match(a, {
            onSome: (a) => ring.sub(a, b),
            onNone: () => b
          }),
          zeroToNone<W>(ring)
        )
      )([a, b])
  )
