import type { Node } from "./nodes/unions/node.js"

/**
 * match on tags and overall structure.
 */
export const softTreeEquality = <K, D, W>(other: Node<K, D, W>) => (self: Node<K, D, W>): boolean => {
  // recurse over tree
  if (other._tag === self._tag) {
    return other.children.map((x, i) => softTreeEquality(x)(self.children[i])).every((x) => x)
  } else return false
}
