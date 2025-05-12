import type { Stream } from "effect"
import type { IZSet } from "../../../objs/i_z_set.js"
import type { Ring } from "../../../objs/ring.js"
import type { Node } from "./nodes/unions/node.js"

/**
 * takes a tree description of some computation and returns its incremental equivalent.
 */
export const exec = <K, D, W>(ring: Ring<W>) => (node: Node<K, D, W>): Stream.Stream<IZSet<K, D, W>> => {
}
