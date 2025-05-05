import type { Option } from "effect"
import { HashMap as HM } from "effect"

export const merge = <V0, V1, V2, K0, K1>(
  f: (a: Option.Option<V0>, b: Option.Option<V1>) => V2
) =>
(that: HM.HashMap<K1, V1>) =>
(self: HM.HashMap<K0, V0>) => {
  const result = HM.beginMutation(HM.empty<K0 | K1, V2>())
  const union = new Set([...HM.keys(self), ...HM.keys(that)])

  union.forEach((key) => {
    HM.set(result, key, f(HM.get(self, key), HM.get(that, key)))
  })
  return HM.endMutation(result)
}
