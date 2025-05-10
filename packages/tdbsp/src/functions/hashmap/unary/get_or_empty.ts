import { HashMap as HM } from "effect"
import { getOrDefault } from "./get_or_default.js"

export const getOrEmpty = <K, Data, V>(key: K) => getOrDefault(key, HM.empty<Data, V>())
