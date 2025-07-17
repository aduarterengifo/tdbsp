import { flow, Stream } from "effect"
import type { Ring } from "../../objs/ring.js"

// expects a stream returns a scalar.
export const integralAprox = <W>(ring: Ring<W>) =>
  flow(
    Stream.takeWhile<W>((n) => n !== ring.zero),
    Stream.runFold<W, W>(ring.zero, (acc, curr) => ring.add(acc, curr))
  )
