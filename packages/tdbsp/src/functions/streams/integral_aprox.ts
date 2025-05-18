import { pipe, Stream } from "effect"
import type { Ring } from "../../objs/ring.js"

export const integralAprox = <W>(ring: Ring<W>) => (s: Stream.Stream<W>) =>
  pipe(
    s,
    Stream.takeWhile<W>((n) => n !== ring.zero),
    Stream.runFold<W, W>(ring.zero, (acc, curr) => ring.add(acc, curr))
  )
