import { HashMap, pipe } from "effect"
import type { IZSet } from "../../objs/i_z_set.js"
import { pickRandom } from "../utils/random.js"
import { deepMapInternal } from "./abstractions/deep_map_internal.js"
import { mapInternal } from "./abstractions/map_internal.js"

export const randomGeneration = <K, D, W>(source: IZSet<K, D, W>) => {
  const [key, zset] = pickRandom(
    Array.from(
      deepMapInternal<K, D, D, W>((map) => pickRandom(Array.from(HashMap.keys(map))))(source).index
    )
  )

  return pipe(
    (map) => HashMap.set(key, zset)(map),
    mapInternal<K, K, D, D, W>
  )
}
