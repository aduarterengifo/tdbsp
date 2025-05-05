import type { Option } from "effect"
import { HashMap as HM } from "effect"
import { getOrEmpty } from "../../../hashmap/unary/get-or-empty.js"
import { foldInternal } from "../../abstractions/fold-internal.js"

/**
 * @leaks
 */
export const getZset = <Key, Data, W>(key: Key) =>
  foldInternal<Key, Data, W, Option.Option<HM.HashMap<Data, W>>>(HM.get(key))

export const getZsetOrEmpty = <Key, Data, W>(key: Key) => foldInternal(getOrEmpty<Key, Data, W>(key))
