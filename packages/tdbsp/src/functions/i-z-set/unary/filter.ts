import { HashMap, pipe } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import { deepMapInternal } from "../abstractions/deep-map-internal.js"

/**
 * @pointfree
 */
export const filter = <K, Data, W>(
  predicate: (w: W, data: Data) => boolean
): (iZSet: IZSet<K, Data, W>) => IZSet<K, Data, W> =>
  pipe(
    HashMap.filter<Data, W>(predicate),
    deepMapInternal<K, Data, Data, W>
  )
