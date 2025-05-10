import type { HashMap as HM, Option } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import { merge } from "../../hashmap/merge.js"
import { make } from "../make.js"

export const mergeOptional = <V0, V1, V2, K0, K1, W0, W1, W2>(
  f: (selfVal: Option.Option<HM.HashMap<V0, W0>>, thatVal: Option.Option<HM.HashMap<V1, W1>>) => HM.HashMap<V2, W2>
) =>
(that: IZSet<K1, V1, W1>) =>
(self: IZSet<K0, V0, W0>): IZSet<K0 | K1, V2, W2> =>
  make<K0 | K1, V2, W2>(
    merge<HM.HashMap<V0, W0>, HM.HashMap<V1, W1>, HM.HashMap<V2, W2>, K0, K1>(f)(that.index)(self.index)
  )

// export const mergeOptionalMap = mergeOptional<V0, V1, V2, K0, K1, W0, W1, W2>()
