import { Option, Stream } from "effect"
import { zipWithPrevious } from "effect/Stream"
import type { AbelianGroup } from "../../../objs/abelian-group.js"

/**
 * Produces an output stream by delaying its input stream by one step.
 */
export const aGDelayOp = <T>(aG: AbelianGroup<T>) => (stream: Stream.Stream<T>) =>
  zipWithPrevious(stream).pipe(
    Stream.map(([prev, _]) =>
      Option.match(prev, {
        onNone: () => aG.zero,
        onSome: (prev) => prev
      })
    )
  )
