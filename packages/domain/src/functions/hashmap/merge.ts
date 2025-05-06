import { HashMap as HM, Option, pipe } from "effect"

export const merge = <V0, V1, V2, K0, K1>(
  f: (selfVal: Option.Option<V0>, thatVal: Option.Option<V1>) => V2
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

export const mergeOptional = <V0, V1, V2, K0, K1>(
  f: (selfVal: Option.Option<V0>, thatVal: Option.Option<V1>) => Option.Option<V2>
) =>
(that: HM.HashMap<K1, V1>) =>
(self: HM.HashMap<K0, V0>) => {
  const result = HM.beginMutation(HM.empty<K0 | K1, V2>())
  const union = new Set([...HM.keys(self), ...HM.keys(that)])

  union.forEach((key) => {
    const value = f(HM.get(self, key), HM.get(that, key))
    if (Option.isSome(value)) {
      HM.set(result, key, value.value)
    }
  })
  return HM.endMutation(result)
}

export const mergePerfect = <V0, V1, V2, K0, K1>(
  f: (thatVal: V1) => (selfVal: V0) => V2
) =>
(that: HM.HashMap<K1, V1>) =>
(self: HM.HashMap<K0, V0>) => {
  const result = HM.beginMutation(HM.empty<K0 | K1, V2>())
  const union = new Set([...HM.keys(self), ...HM.keys(that)])

  union.forEach((key) =>
    Option.composeK(
      (x: Option.Option<[V0, V1]>) => x,
      ([a, b]) => {
        return Option.some(HM.set(result, key, f(b)(a)))
      } // side-effect
    )(Option.all([HM.get(self, key), HM.get(that, key)]))
  )
  return HM.endMutation(result)
}
