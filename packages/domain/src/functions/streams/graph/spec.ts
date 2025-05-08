import type { Schema } from "effect"
import type { NonEmptyArray } from "effect/Array"
import type { IZSet } from "../../../objs/i-z-set.js"

// for now these ONLY operate on z-sets.

// what is valid?
// const distinctOp = Schema.TaggedStruct("distinct", {
//   children: Schema.Any // another node
// })

// const stream = Schema.TaggedStruct("stream", {
//     stream: Schema.Stream
//   children: Schema.Any // another node
// })

// nodes should keep as little info as possible
export type Node<K, Dout, W> =
  | NodeDistinctOp<K, Dout, W>
  | NodeStream<K, Dout, W>
  | NodeAddOp<K, Dout, W>
  | NodeDeIndexOp<K, Dout, W>
  | NodeFilterOp<K, Dout, W>
  | NodeIndexOp<K, Dout, W>
  | NodeJoinOp<K, any, any, Dout, W>
  | NodeMapOp<K, any, Dout, W>
  | NodeMulOp<K, Dout, W>
  | NodeSubOp<K, Dout, W>
  | NodeUnionOp<K, Dout, W>
  | NodeEnd<K, Dout, W>

export type NodeTag = Node<any, any, any>["_tag"]

export type NodeStream<K, Dout, W> = {
  readonly _tag: "stream"
  readonly stream: Schema.Schema<IZSet<K, Dout, W>>
  readonly children: Array<Node<K, Dout, W>>
}

export type NodeEnd<K, Dout, W> = {
  readonly _tag: "end"
  readonly children: Array<Node<K, Dout, W>>
}

export type NodeDistinctOp<K, Dout, W> = {
  readonly _tag: "distinct"
  readonly children: Array<Node<K, Dout, W>>
}

export type NodeAddOp<K, Dout, W> = {
  readonly _tag: "add"
  readonly children: Array<Node<K, Dout, W>>
}

export type NodeDeIndexOp<Kin, Dout, W> = {
  readonly _tag: "deindex"
  readonly children: Array<Node<Kin, Dout, W>>
}

// in this case Dout = Din
export type NodeFilterOp<K, Dout, W> = {
  readonly _tag: "filter"
  readonly children: Array<Node<K, Dout, W>>
  readonly fn: (w: W, d: Dout) => boolean
}

export type NodeIndexOp<K, Dout, W> = {
  readonly _tag: "index"
  readonly children: Array<Node<K, Dout, W>>
}

export type NodeJoinOp<K, DinA, DinB, Dout, W> = {
  readonly _tag: "join"
  readonly children: Array<Node<K, Dout, W>>
  readonly fn: (a: DinA, b: DinB) => Dout
}

/**
 * also: SELECT
 */
export type NodeMapOp<K, Din, Dout, W> = {
  readonly _tag: "map"
  readonly children: [Node<K, Dout, W>] // single element
  readonly fn: (d: Din) => Dout
}

export type NodeMulOp<K, Dout, W> = {
  readonly _tag: "mul"
  readonly children: Array<Node<K, Dout, W>>
}

export type NodeSubOp<K, Dout, W> = {
  readonly _tag: "mul"
  readonly children: Array<Node<K, Dout, W>>
}

export type NodeUnionOp<K, Dout, W> = {
  readonly _tag: "mul"
  readonly children: Array<Node<K, Dout, W>>
}

export const recursiveTower = <K, D, W>(
  tags: NonEmptyArray<NodeTag>,
  init?: Node<K, D, W>
): Node<K, D, W> => {
  const root: Node<K, D, W> = init || { _tag: tags[0], children: [] }

  if (tags.length === 1) {
    return root
  }
  const nextNode: Node<K, D, W> = { _tag: tags[1], children: [] }

  root.children.push(nextNode)

  recursiveTower(tags.slice(1), nextNode)

  return root
}

export const recursiveTowerNodes = <K, Dout, W>(
  nodes: NonEmptyArray<Node<K, Dout, W>>,
  init?: Node<K, Dout, W>
): Node<K, Dout, W> => {
  const root: Node<K, Dout, W> = init || nodes[0]

  if (nodes.length === 1) {
    return root
  }
  const nextNode: Node<K, Dout, W> = nodes[1]

  root.children.push(nextNode)

  recursiveTowerNodes(nodes.slice(1), nextNode)

  return root
}

export const computationGraphTest = () => ({
  _tag: "end",
  children: [{
    _tag: "distinct",
    children: [{
      _tag: "map",
      children: [{
        _tag: "join",
        children: [
          {
            _tag: "index",
            children: [
              {
                _tag: "deindex",
                children: [{
                  _tag: "map",
                  children: []
                }]
              }
            ]
          },
          {
            _tag: "index",
            children: []
          }
        ]
      }]
    }]
  }]
})
