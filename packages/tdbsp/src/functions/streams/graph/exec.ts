import type { Stream } from "effect"
import { Match } from "effect"
import type { IZSet, ZSet } from "../../../objs/i-z-set.js"
import type { Ring } from "../../../objs/ring.js"
import { add } from "../lifted-add.js"
import { deindex } from "../lifted-de-index.js"
import { distinct } from "../lifted-distinct.js"
import { filter } from "../lifted-filter.js"
import { index } from "../lifted-index.js"
import { join } from "../lifted-join.js"
import { map } from "../lifted-map.js"
import { mul } from "../lifted-multiply.js"
import { sub } from "../lifted-sub.js"
import { liftedUnion } from "../union.js"
import type { Node } from "./nodes/unions/node.js"

/**
 * executes the computation graph.
 */
export const exec = <K, D, W>(ring: Ring<W>) => (node: Node<K, D, W>): Stream.Stream<IZSet<K, D, W>> =>
  Match.value(node).pipe(
    // binary
    Match.tag("AddNode", ({ children }) => {
      // get the stream of my two children
      const [a, b] = children.map(exec<K, D, W>(ring))
      return add<K, D, W>(ring)(a)(b)
    }),
    Match.tag("SubNode", ({ children }) => {
      const [a, b] = children.map(exec<K, D, W>(ring))
      return sub<K, D, W>(ring)(a)(b)
    }),
    Match.tag("MulNode", ({ children, fn }) => {
      const [a, b] = children.map(exec<K, D, W>(ring))
      return mul<K, D, W>(ring)(fn)(b)(a)
    }),
    Match.tag("UnionNode", ({ children }) => {
      const [a, b] = children.map(exec<K, D, W>(ring))
      return liftedUnion<K, D, W>(ring)(a)(b)
    }),
    Match.tag("JoinNode", ({ children, fn }) => {
      const [a, b] = children.map(exec<K, D, W>(ring))
      // biome-ignore lint/suspicious/noExplicitAny: PROBLEMS
      return join<K, any, D, D, W>(ring)(fn)(b)(a)
    }),
    // unary
    Match.tag("FilterNode", ({ children, fn }) => {
      const [a] = children.map(exec<K, D, W>(ring))
      return filter<K, D, W>(fn)(a)
    }),
    // // stream nodes just return themselves, an identity essentially.
    Match.tag("StreamNode", ({ stream }) => stream),
    // // basically identity.
    Match.tag("EndNode", ({ children }) => exec<K, D, W>(ring)(children[0])),
    Match.tag("DistinctNode", ({ children }) => {
      const [a] = children.map(exec<K, D, W>(ring))
      return distinct<K, D, W>(ring)(a)
    }),
    Match.tag("DeIndexNode", ({ children }) => {
      const [a] = children.map(exec<K, D, W>(ring))
      return deindex<K, D, W>()(a) as Stream.Stream<IZSet<K, D, W>> // for now
    }),
    Match.tag("IndexNode", ({ children, fn }) => {
      // CHEATING TODO: longterm probably move away from Zsets, I don't think they add much value.
      const [a] = children.map(exec<K, D, W>(ring)) as unknown as [Stream.Stream<ZSet<D, W>, never, never>]
      const t = index<K, D, W>(fn)(a)
      return t
    }),
    Match.tag("MapNode", ({ children, fn }) => {
      const [a] = children.map(exec<K, D, W>(ring))
      // biome-ignore lint/suspicious/noExplicitAny: PROBLEMS
      return map<K, any, D, W>(fn)(a)
    }),
    Match.exhaustive
  )
