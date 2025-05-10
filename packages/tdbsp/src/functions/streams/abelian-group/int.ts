import { Stream } from "effect"
import type { AbelianGroup } from "../../../objs/abelian_group.js"

// TODO: investigate definition using unfold.
/**
 * The unique operator satisfying s + z^-1(a)  = a
 */
export const aGIntOp = <T>(aG: AbelianGroup<T>) => (s: Stream.Stream<T>) =>
  s.pipe(
    Stream.scan(aG.zero, (a, b) => aG.add(a, b)),
    Stream.drop(1)
  )
