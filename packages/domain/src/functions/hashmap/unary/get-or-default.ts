import { HashMap as HM, Option } from "effect"

export const getOrDefault = <K, V>(key: K, fallback: V) => (self: HM.HashMap<K, V>) =>
  HM.get(key)(self).pipe(Option.getOrElse(() => fallback))
