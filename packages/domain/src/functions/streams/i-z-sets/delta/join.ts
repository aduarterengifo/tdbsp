import type { HashMap as HM, Stream } from "effect"
import type { IZSet } from "../../../../objs/i-z-set.js"
import type { Ring } from "../../../../objs/ring.js"
import { join } from "../../lifted-join.js"

export const distinctJoin = <
  K,
  D0,
  D1,
  D2,
  W
>(ring: Ring<W>) =>
(
  fn: (m0: HM.HashMap<D0, W>, m1: HM.HashMap<D1, W>) => HM.HashMap<D2, W>,
  iSelf: (d: D0) => K,
  iOther: (d: D1) => K
) =>
(other: Stream.Stream<IZSet<K, D1, W>>) =>
(self: Stream.Stream<IZSet<K, D0, W>>) => {
  join < K, D
}
