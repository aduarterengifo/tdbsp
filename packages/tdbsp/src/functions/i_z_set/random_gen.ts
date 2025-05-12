import { HashMap } from "effect"
import type { IZSet } from "../../objs/i_z_set.js"
import { randomElem } from "../utils/random.js"
import { deepMapInternal } from "./abstractions/deep_map_internal.js"
import { make } from "./make.js"

export const randomGen =
  <K, D, W>(source: IZSet<K, D, W>) =>
  (self: IZSet<K, D, W>): { newZSet: IZSet<K, D, W>; changeInstance: IZSet<K, D, W> } => {
    const [key, zset] = randomElem(
      Array.from(
        deepMapInternal<K, D, D, W>((map) => randomElem(Array.from(HashMap.keys(map))))(source).index
      )
    )

    return ({
      newZSet: make<K, D, W>(HashMap.set(key, zset)(self.index)),
      changeInstance: make<K, D, W>(HashMap.fromIterable([[key, zset]]))
    })
  }
