import { iZSetDiffOp } from "../abelian-group/i_zset_stream/diff.js"
import { diffNodeMake } from "./nodes/diff.js"
import type { Node } from "./nodes/unions/node.js"

// two versions, one with I and D and the Other with introduction and elimination.
export const bracketID = <K, D, W>(node: Node<K, D, W>) => {
  // wrap
  return diffNodeMake<K, D, W>()({
    children: [node, node]
  })
}
