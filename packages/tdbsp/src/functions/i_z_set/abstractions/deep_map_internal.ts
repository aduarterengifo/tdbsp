import { HashMap as HM, pipe } from "effect"
import { mapInternal } from "./map_internal.js"

/**
 * core abstraction
 * returns a z-set with the function applied to the underlying hashmap.
 */
export const deepMapInternal = <K, D0, D1, W0>(f: (map: HM.HashMap<D0, W0>) => HM.HashMap<D1, W0>) =>
  pipe(
    HM.map<HM.HashMap<D1, W0>, HM.HashMap<D0, W0>, K>(f),
    mapInternal
  )

// export const ultraDeepMapInternal = <K, D0, D1, W0>(f: (data: W0, key: D0) => D1) => {
//   const t = HM.map(f)
//   return pipe(
//     HM.map<HM.HashMap<D1, W0>, HM.HashMap<D0, W0>, K>(t),
//     mapInternal
//   )
// }
