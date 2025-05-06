import type { Stream } from "effect"
import { pipe } from "effect"
import type { IZSet } from "../../objs/i-z-set.js"
import type { Ring } from "../../objs/ring.js"
import { add } from "./lifted-add.js"
import { distinct } from "./lifted-distinct.js"

export const liftedUnion =
  <K, D, W>(ring: Ring<W>) => (other: Stream.Stream<IZSet<K, D, W>>) => (self: Stream.Stream<IZSet<K, D, W>>) =>
    pipe(
      self,
      add<K, D, W>(ring)(other),
      distinct<K, D, W>(ring)
    )
