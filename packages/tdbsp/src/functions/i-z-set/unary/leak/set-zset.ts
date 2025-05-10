import { HashMap as HM } from "effect"
import { mapInternal } from "../../abstractions/map-internal.js"

/**
 * @immutable
 * @leaks
 */
export const setZset = <Key, Data, W>(key: Key, zset: HM.HashMap<Data, W>) => mapInternal(HM.set(key, zset))
