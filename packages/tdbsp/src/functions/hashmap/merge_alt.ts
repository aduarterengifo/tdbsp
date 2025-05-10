import type { Option } from "effect"
import { HashMap as HM } from "effect"
import { beginMutation, endMutation } from "effect/HashMap"

export const mergeInternal = <K0, K1, W1, W2>(
  mergeFn: (existingValue: Option.Option<W1>, newValue: W2) => Option.Option<W1>
) =>
(other: HM.HashMap<K0, W2>) =>
(self: HM.HashMap<K1, W1>) => {
  let result: HM.HashMap<K0 | K1, W1> = beginMutation(self)
  HM.forEach(
    other,
    (v, k) => {
      result = HM.modifyAt<K0 | K1, W1>(result, k, (existingValue) => {
        return mergeFn(existingValue, v)
      })
    }
  )

  return endMutation(result)
}
