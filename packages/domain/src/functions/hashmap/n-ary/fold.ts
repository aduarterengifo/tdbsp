import { HashMap as HM, Option } from "effect"

export const foldOptional = <K, V>(
  f: (a: Option.Option<V>, b: V) => Option.Option<V>
) =>
(
  maps: Array<HM.HashMap<K, V>>
): HM.HashMap<K, V> =>
  maps.reduce(
    (outerAcc, curr) =>
      HM.reduce(
        curr,
        outerAcc,
        (acc, val, key) => HM.modifyAt<K, V>(key, (eVal) => f(eVal, val))(acc)
      ),
    HM.empty<K, V>()
  )

export const fold = <K, V>(
  f: (a: V, b: V) => V
) =>
  foldOptional<K, V>((a, b) =>
    Option.match(a, {
      onSome: (a) => Option.some(f(a, b)),
      onNone: () => Option.some(b)
    })
  )
