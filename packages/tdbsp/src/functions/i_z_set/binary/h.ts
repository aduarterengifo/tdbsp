import { type HashMap as HM, Option, pipe } from "effect"
import type { IZSet } from "../../../objs/i_z_set.js"
import type { Ring } from "../../../objs/ring.js"
import { zeroToNone } from "../../../objs/utils/ring.js"
import { mergeOptional } from "../../hashmap/merge.js"
import { fold } from "../abstractions/deep_fold_internal.js"
import { add as iZSetAdd } from "./add.js"

// TODO: do optional and do empty elimination. ALA zero weight elimination.
export const h = <Key, Data, W>(ring: Ring<W>) => (d: IZSet<Key, Data, W>) => (i: IZSet<Key, Data, W>) =>
  fold<Key, Data, W>(
    (i: HM.HashMap<Data, W>, iPlusD: HM.HashMap<Data, W>) => {
      return mergeOptional<W, W, W, Data, Data>((iW, iPlusDW) => {
        console.log("iw", Option.getOrElse(iW, () => ring.zero), "iPlusDW", Option.getOrElse(iPlusDW, () => ring.zero))
        return pipe(
          hCore(ring)(Option.getOrElse(iW, () => ring.zero))(Option.getOrElse(iPlusDW, () => ring.zero)),
          zeroToNone<W>(ring)
        )
      })(iPlusD)(i)
    }
  )([i, iZSetAdd<Key, Data, W>(ring)([i, d])])

const hCore = <W>(ring: Ring<W>) => (iW: W) => (iPlusDW: W) =>
  ring.leq(ring.zero, iW) && iW !== ring.zero && ring.leq(iPlusDW, ring.zero)
    ? ring.sub(ring.zero, ring.one)
    : ring.leq(iW, ring.zero) && ring.leq(ring.zero, iPlusDW) && iPlusDW !== ring.zero
    ? ring.one
    : ring.zero
