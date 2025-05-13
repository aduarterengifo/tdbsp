import type { FilterNode } from "../filter.js"
import type { JoinNode } from "../join.js"
import type { MulNode } from "../mul.js"

export type Prop44Node<K, D, W> =
  | FilterNode<K, D, W>
  | JoinNode<K, any, any, D, W>
  | MulNode<K, D, W>

// probably not needed.
// export const makeProp44Q = <K, D, W>(node: Prop44Node<K, D, W>) =>
//   Match.value(node).pipe(
//     Match.tag("FilterNode", () => {}),
//     Match.tag("JoinNode", () => {}),
//     Match.tag("MulNode", () => {})
//   )
