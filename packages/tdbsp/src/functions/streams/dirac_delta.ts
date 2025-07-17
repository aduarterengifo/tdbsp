import { Effect, flow, Option, Stream } from "effect"
import type { Ring } from "../../objs/ring.js"
import type { ScalarWrap } from "../../objs/scalar_wrap.js"

// expects a scalar returns a stream of scalars.
export const diracDelta = <W>(ring: Ring<W>) => (value: W) =>
  Stream.unfold(
    ring.one,
    (n) =>
      Option.some([
        n === ring.one
          ? value
          : ring.zero,
        ring.zero
      ])
  )

export const diractDeltaStreamWrap = <W>(ring: Ring<W>) =>
  flow(
    Stream.runCollect<ScalarWrap<W>, never, never>,
    Effect.flatMap(([value]) => Effect.succeed(diracDelta<W>(ring)(value.value)))
  )
