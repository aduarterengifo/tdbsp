import type { HashMap as HM } from "effect"
import { Option, pipe } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { zeroToNone } from "../../../objs/utils/ring.js"
import { foldOptional } from "../n_ary/fold.js"

export const add = <Data, W>(ring: Ring<W>) => (a: HM.HashMap<Data, W>, b: HM.HashMap<Data, W>) =>
  foldOptional<Data, W>((a, b) =>
    pipe(
      Option.match(a, {
        onSome: (a) => ring.add(a, b),
        onNone: () => b
      }),
      zeroToNone<W>(ring)
    )
  )([a, b])
