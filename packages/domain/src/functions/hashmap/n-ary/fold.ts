import { HashMap as HM, Option } from "effect"

export const foldOptional = <K, V>(
  f: (a: Option.Option<V>, b: Option.Option<V>) => Option.Option<V>
) =>
(
  ...iZSets: Array<HM.HashMap<K, V>>
): HM.HashMap<K, V> =>
  iZSets.reduce(
    (outerAcc, curr) =>
      HM.reduce(
        curr,
        outerAcc,
        (acc, val, key) => HM.modifyAt<K, V>(key, (existingValue) => f(existingValue, Option.some(val)))(acc)
      ),
    HM.empty<K, V>()
  )

export const fold = <K, V>(
  f: (a: V, b: V) => V
) =>
  foldOptional<K, V>((a, b) =>
    Option.match(a, {
      onSome: (a) =>
        Option.match(b, {
          onSome: (newValue) => Option.some(f(a, newValue)),
          onNone: () => Option.some(a)
        }),
      onNone: () => b
    })
  )
