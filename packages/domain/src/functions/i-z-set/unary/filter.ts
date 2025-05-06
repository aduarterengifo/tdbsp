import { HashMap, pipe } from "effect"
import { deepMapInternal } from "../abstractions/deep-map-internal.js"

/**
 * @pointfree
 */
export const filter = <Key, Data, W>(predicate: (w: W, data: Data) => boolean) =>
  pipe(
    HashMap.filter<Data, W>(predicate),
    deepMapInternal<Key, Data, Data, W>
  )
