import { Option, Stream } from "effect"
import type { Ring } from "../../objs/ring.js"

export const diractDelta = <W>(ring: Ring<W>) => (value: W): Stream.Stream<W> =>
  Stream.unfold(ring.one, (n) => Option.some([n === ring.one ? value : ring.zero, ring.zero]))
