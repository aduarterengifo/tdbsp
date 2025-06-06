import { type HashMap as HM, pipe } from "effect"
import type { IZSet } from "../../../objs/i_z_set.js"
import { make } from "../make.js"
import { foldInternal } from "./fold_internal.js"

/**
 * core abstraction
 * returns a z-set with the function applied to the underlying hashmap.
 */
export const mapInternal =
  <K0, K1, D0, D1, W0>(f: (map: HM.HashMap<K0, HM.HashMap<D0, W0>>) => HM.HashMap<K1, HM.HashMap<D1, W0>>) =>
  (iZSet: IZSet<K0, D0, W0>) =>
    pipe(
      foldInternal(f)(iZSet),
      make<K1, D1, W0>
    )
