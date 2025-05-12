import { Match } from "effect"
import type { Ring } from "../../../objs/ring.js"
import type { Node } from "./nodes/unions/node.js"
import { isProp45Q } from "./utils.js"

/**
 * takes a tree description of some computation and returns its incremental equivalent.
 */
export const incrementalize = <K, D, W>(ring: Ring<W>) => (node: Node<K, D, W>): Node<K, D, W> => {
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

export const simplProp45 = (node: Node<K, D, W>): Node<K, D, W> => {
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
