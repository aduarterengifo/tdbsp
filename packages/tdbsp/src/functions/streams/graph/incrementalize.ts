import { Match, pipe } from "effect"
import type { Ring } from "../../../objs/ring.js"
import { addNodeMake } from "./nodes/add.js"
import { deIndexNodeMake } from "./nodes/de_index.js"
import { delayNodeMake } from "./nodes/delay.js"
import { deltaDistinctNodeMake } from "./nodes/delta-distinct.js"
import { deltaJoinNodeMake } from "./nodes/delta-join.js"
import { distinctNodeMake } from "./nodes/distinct.js"
import { endNodeMake } from "./nodes/end.js"
import { filterNodeMake } from "./nodes/filter.js"
import { indexNodeMake } from "./nodes/index.js"
import { mapNodeMake } from "./nodes/map.js"
import { mulNodeMake } from "./nodes/mul.js"
import { subNodeMake } from "./nodes/sub.js"
import { unionNodeMake } from "./nodes/union.js"
import type { Node } from "./nodes/unions/node.js"
import { isProp44Q, isProp45Q } from "./utils.js"

// it doesn't make sense for me to infer that this will be an endnode because that would break composition.
export const simplAndIncrementalize = <K, D, W>(ring: Ring<W>) => (node: Node<K, D, W>) =>
  pipe(
    node,
    simplifyUntilConvergence,
    incrementalize<K, D, W>(ring)
  )

/**
 * takes a tree description of some computation and returns its incremental equivalent.
 * assume that distinct elimination was already occured.
 */
export const incrementalize = <K, D, W>(ring: Ring<W>) => (node: Node<K, D, W>): Node<K, D, W> => {
  return Match.value(node).pipe(
    Match.tag("StreamNode", (node) => node), // base case, do not recurse
    Match.tag("EndNode", ({ children: [a] }) =>
      endNodeMake<K, D, W>()({
        children: [incrementalize<K, D, W>(ring)(a)]
      })),
    Match.tag("AddNode", ({ children: [a, b] }) =>
      addNodeMake<K, D, W>()({
        children: [incrementalize<K, D, W>(ring)(a), incrementalize<K, D, W>(ring)(b)]
      })),
    Match.tag("DelayNode", ({ children: [a] }) =>
      delayNodeMake<K, D, W>()({
        children: [incrementalize<K, D, W>(ring)(a)]
      })),
    Match.tag("SubNode", ({ children: [a, b] }) =>
      subNodeMake<K, D, W>()({
        children: [incrementalize<K, D, W>(ring)(a), incrementalize<K, D, W>(ring)(b)]
      })),
    Match.tag("JoinNode", ({ children, fn }) =>
      deltaJoinNodeMake<K, unknown, unknown, D, W>()({
        children: children.map((child) => incrementalize<K, D, W>(ring)(child)) as [
          Node<K, unknown, W>,
          Node<K, unknown, W>
        ],
        fn
      })),
    Match.tag("DistinctNode", ({ children: [a] }) =>
      deltaDistinctNodeMake<K, D, W>()({
        children: [incrementalize<K, D, W>(ring)(a)]
      })),
    Match.tag("MapNode", ({ children: [a], fn }) =>
      mapNodeMake<K, any, D, W>()({
        children: [incrementalize<K, D, W>(ring)(a)],
        fn
      })),
    Match.tag("FilterNode", ({ children: [a], fn }) =>
      filterNodeMake<K, D, W>()({
        children: [incrementalize<K, D, W>(ring)(a)],
        fn
      })),
    Match.tag(
      "DeltaDistinctNode",
      ({ children: [a] }) =>
        deltaDistinctNodeMake<K, D, W>()({
          children: [incrementalize<K, D, W>(ring)(a)]
        })
    ),
    Match.tag(
      "DeltaJoinNode",
      ({ children: [a, b], fn }) =>
        deltaJoinNodeMake<K, any, any, D, W>()({
          children: [incrementalize<K, D, W>(ring)(a), incrementalize<K, D, W>(ring)(b)],
          fn
        })
    ),
    Match.tag("DeIndexNode", ({ children: [a] }) =>
      deIndexNodeMake<K, D, W>()({
        children: [incrementalize<K, D, W>(ring)(a)]
      })),
    Match.tag("IndexNode", ({ children: [a], fn }) =>
      indexNodeMake<any, K, D, W>()({
        children: [incrementalize<K, D, W>(ring)(a)],
        fn
      })),
    Match.tag("MulNode", ({ children: [a, b], fn }) =>
      mulNodeMake<K, D, W>()({
        children: [incrementalize<K, D, W>(ring)(a), incrementalize<K, D, W>(ring)(b)],
        fn
      })),
    Match.tag("UnionNode", ({ children: [a, b] }) =>
      unionNodeMake<K, D, W>()({
        children: [incrementalize<K, D, W>(ring)(a), incrementalize<K, D, W>(ring)(b)]
      })),
    Match.exhaustive
  )
}

// 4.5
// for ops:
//   - project
//   - map(f)^2
//   - addition
//   - filter
//   - join
//   - mul
// ispositive(s) => distinct(Q(distinct(s))) = distinct(Q(i))
export const runProp45 = <K, D, W>(ring: Ring<W>) => (node: Node<K, D, W>): Node<K, D, W> => {
}

export const simplProp45 = <K, D, W>(node: Node<K, D, W>): Node<K, D, W> => {
  Match.value(node).pipe(
    Match.tag("DistinctNode", (node) => {
      const [childNode] = node.children
      if (isProp45Q(childNode)) {
        const [grandChildNode] = childNode.children
        Match.value(grandChildNode).pipe(
          Match.tag("DistinctNode", (grandChildNode) => {
            childNode.children[0] = grandChildNode.children[0]
            return node
          })
        )
      }
    })
  )
  if (node.children) {
    node.children = node.children.map(simplProp45)
  }
  return node
}

// Q(distinct(i)) -> distinct(Q(i))
export const simplProp44 = <K, D, W>(node: Node<K, D, W>): Node<K, D, W> => {
  if (isProp44Q(node)) { // is the node Q
    if (node.children.every((x) => x._tag === "DistinctNode")) { // are the args to Q distinct?
      // Q(distinct(i)) precisely.
      node.children = node.children.map((child) => child.children[0])
      return distinctNodeMake<K, D, W>()({
        children: [node]
      })
    }
  }
  if (node.children) {
    node.children = node.children.map(simplProp44)
  }
  return node
}

export const simplifyUntilConvergence = <K, D, W>(node: Node<K, D, W>): Node<K, D, W> => {
  let previousNode: Node<K, D, W> | null = null
  let currentNode: Node<K, D, W> = node

  do {
    previousNode = currentNode
    currentNode = simplProp45(currentNode)
    currentNode = simplProp44(currentNode)
  } while (currentNode !== previousNode)

  return currentNode
}

// for now we are skipping lifting. we are describing things that are already lifted,
// I will do that later when I feel like it.
// I can apply the rules: prop4.4 and prop4.5.
// now what is left is to apply as incrementalization

// 4.4
// for ops:
//   - filter
//   - join
//   - mul
// ispositive(s) => Q(distinct(s)) = distinct(Q(i))

// 4.5
// for ops:
//   - project
//   - map(f)^2
//   - addition
//   - filter
//   - join
//   - mul
// ispositive(s) => distinct(Q(distinct(s))) = distinct(Q(i))
