import { diffNodeMake } from "./nodes/diff.js"
import { elimNodeMake } from "./nodes/elim.js"
import { integralNodeMake } from "./nodes/integral.js"
import { introNodeMake } from "./nodes/intro.js"
import type { Node } from "./nodes/unions/node.js"

// two versions, one with I and D and the Other with introduction and elimination.
export const bracketID = <K, D, W>(node: Node<K, D, W>) =>
  diffNodeMake<K, D, W>()({
    children: [{ ...node, children: [integralNodeMake<K, D, W>()({ children: node.children })] } as Node<K, D, W>]
  })

export const bracketIntroElim = <K, D, W>(node: Node<K, D, W>) =>
  introNodeMake<K, D, W>()({
    children: [{ ...node, children: [elimNodeMake<K, D, W>()({ children: node.children })] } as Node<K, D, W>]
  })
