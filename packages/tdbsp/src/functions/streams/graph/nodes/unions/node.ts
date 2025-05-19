import type { AddNode } from "../add.js"
import type { DeIndexNode } from "../de_index.js"
import type { DelayNode } from "../delay.js"
import type { DeltaDistinctNode } from "../delta-distinct.js"
import type { DeltaJoinNode } from "../delta-join.js"
import type { DistinctNode } from "../distinct.js"
import type { EndNode } from "../end.js"
import type { FilterNode } from "../filter.js"
import type { FixPointNode } from "../fixpoint.js"
import type { IndexNode } from "../index.js"
import type { JoinNode } from "../join.js"
import type { MapNode } from "../map.js"
import type { MulNode } from "../mul.js"
import type { StreamNode } from "../stream.js"
import type { SubNode } from "../sub.js"
import type { UnionNode } from "../union.js"

export type Node<K, D, W> =
  | StreamNode<K, D, W>
  | EndNode<K, D, W>
  | DistinctNode<K, D, W>
  | DeIndexNode<K, D, W>
  | IndexNode<any, K, D, W>
  | FilterNode<K, D, W>
  | MapNode<K, any, D, W>
  | AddNode<K, D, W>
  | JoinNode<K, any, any, D, W>
  | MulNode<K, D, W>
  | SubNode<K, D, W>
  | UnionNode<K, D, W>
  | DeltaDistinctNode<K, D, W>
  | DeltaJoinNode<K, any, any, D, W>
  | DelayNode<K, D, W>
  | FixPointNode<K, D, W>
