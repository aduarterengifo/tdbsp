import { Data, type Schema, type Stream } from "effect"
import type { NonEmptyArray } from "effect/Array"
import type { IZSet } from "../../../objs/i-z-set.js"
import { Ring } from "../../../objs/ring.js"
import { BaseA, BaseAMap } from "../../../data/a.js"
import { BaseB, BaseBMap } from "../../../data/b.js"

// for now these ONLY operate on z-sets.

// what is valid?
// const distinctOp = Schema.TaggedStruct("distinct", {
//   children: Schema.Any // another node
// })

// const stream = Schema.TaggedStruct("stream", {
//     stream: Schema.Stream
//   children: Schema.Any // another node
// })

// A philosophical question of representation, is Din = Din or Dout = Dout

// nodes should keep as little info as possible
type NodeAlt<K0, D0,D1, W> = Data.TaggedEnum<{
    Stream: {
    readonly stream: Stream.Stream<IZSet<K0, D1, W>>
    readonly children: []
    },
    End: {
    readonly children: Array<NodeAlt<K0, any, D0, W>>
    },
    Distinct: {
        children: NodeAlt<K0, any, D0, W>[],
        readonly fn: (b: D0) => D0
    },
    DeIndex: {
    readonly children: [NodeAlt<K0, any, D0, W>]
    },
    Index: {
    readonly children: [NodeAlt<K0, any, D0, W>]
    readonly fn: (d: D0) => K0 // Dout = Din in this case.
    },
    Filter: {
    readonly children: [NodeAlt<K0, any, D0, W>]
    readonly fn: (w: W, d: D1) => boolean
    },
    Map: {
    // biome-ignore lint/suspicious/noExplicitAny: cause its fine
    readonly children: [NodeAlt<K0, any, D0, W>] // single element
    readonly fn: (d: D0) => D1
    },
    // binary
    // I take in nodes in that output Din,
    Add: {
    readonly children: [NodeAlt<K0, any, D0, W>, NodeAlt<K0, any,D0, W>]
    },
    Join: { // secondary Din fuck!
    readonly children: [NodeAlt<K0, any, D0, W>, NodeAlt<K0, any, D0, W>]
    readonly fn: (a: DinA, b: DinB) => D1
    },
    Mul: {
    readonly children: [NodeAlt<K0, any, D0, W>, NodeAlt<K0, any, D0, W>]
    },
    Sub: {
    readonly children: [NodeAlt<K0, any,D0, W>, NodeAlt<K0, any,D0, W>]
    },
    Union: {
    readonly children: [NodeAlt<K0, any, D0, W>, NodeAlt<K0, any, D0, W>]
    }
}>

const taggedEnum = <K,Din,Dout,W>() => Data.taggedEnum<NodeAlt<K,Din,Dout,W>>()

// const distinctMake = <K,Dout,W>() => taggedEnum().Distinct

// const specificMake = distinctMake<number,number,number>() 

// const instance = specificMake({children: [], fn: () => '33'})


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
  readonly children: []
}

export type NodeEnd<K, Dout, W> = {
  readonly _tag: "end"
  readonly children: Array<Node<K, Dout, W>>
}

export type NodeDistinctOp<K, Dout, W> = {
  readonly _tag: "distinct"
  readonly children: [Node<K, Dout, W>]
}

export type NodeAddOp<K, Dout, W> = {
  readonly _tag: "add"
  readonly children: [Node<K, Dout, W>, Node<K, Dout, W>]
}

export type NodeDeIndexOp<Kin, Dout, W> = {
  readonly _tag: "deindex"
  readonly children: [Node<Kin, Dout, W>]
}

// in this case Dout = Din
export type NodeFilterOp<K, Dout, W> = {
  readonly _tag: "filter"
  readonly children: [Node<K, Dout, W>]
  readonly fn: (w: W, d: Dout) => boolean
}

export type NodeIndexOp<K, Dout, W> = {
  readonly _tag: "index"
  readonly children: [Node<K, Dout, W>]
  readonly fn: (d: Dout) => K // Dout = Din in this case.
}

export type NodeJoinOp<K, DinA, DinB, Dout, W> = {
  readonly _tag: "join"
  readonly children: [Node<K, Dout, W>, Node<K, Dout, W>]
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
  readonly children: [Node<K, Dout, W>, Node<K, Dout, W>]
}

export type NodeSubOp<K, Dout, W> = {
  readonly _tag: "sub"
  readonly children: [Node<K, Dout, W>, Node<K, Dout, W>]
}

export type NodeUnionOp<K, Dout, W> = {
  readonly _tag: "mul"
  readonly children: [Node<K, Dout, W>, Node<K, Dout, W>]
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

// the fucked thing 

export const computationGraphTest = <K, D0 extends BaseA,D1 extends BaseB, W>(ring: Ring<W>) =>
(
  Sa: Stream.Stream<IZSet<K, D0, W>>,
  Sb: Stream.Stream<IZSet<K, D1, W>>
) => { 

    const sub1 = taggedEnum<K,D1,D1,W>().Stream({
        stream: Sb,
        children: []
    })

    const sub  =  taggedEnum<K,D1,D1,W>().Filter({
        fn: (_, { s }) => s > 5,
        children: [
            sub1
        ]
    })

    return ({
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
            fn: ({ id }) => id,
            children: [
              {
                _tag: "deindex",
                children: [
                  {
                    _tag: "map",
                    fn: ({ id, x }) =>
        Data.struct({
          x,
          id
        }),
                    children: [
                      {
                        _tag: "filter",
                        fn: (_, { a }) => a > 2,
                        children: [
                          {
                            _tag: "stream",
                            stream: Sa
                            children: []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          taggedEnum<number,BaseBMap,BaseBMap,W>().Index({
            fn: ({ id }) => id,
            children: [
                taggedEnum<K,BaseBMap,BaseBMap,W>().DeIndex({
                    children: [
                        taggedEnum<K,D1,BaseBMap,W>().Map({
                            fn: ({ id, y }) =>
                            Data.struct({
                            y,
                            id
                            }),
                            children: [                        
                                taggedEnum<K,D1,D1,W>().Filter({
                                    fn: (_, { s }) => s > 5,
                                    children: [
                                        taggedEnum<K,D1,D1,W>().Stream({
                                            stream: Sb,
                                            children: []
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            ]
          })
        ]
      }]
    }]
  }]
})}
