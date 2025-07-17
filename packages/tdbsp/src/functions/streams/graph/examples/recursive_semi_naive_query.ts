import type { Stream } from "effect"
import { Schema } from "effect"
import { PrettyNumber } from "../../../../data/a.js"
import type { IZSet } from "../../../../objs/i_z_set.js"
import type { Ring } from "../../../../objs/ring.js"
import { bracketIntroElim } from "../bracket.js"
import { addNodeMake } from "../nodes/add.js"
import { deltaDistinctNodeMake } from "../nodes/delta-distinct.js"
import { deltaJoinNodeMake } from "../nodes/delta-join.js"
import { endNodeMake } from "../nodes/end.js"
import { fixPointNodeMake } from "../nodes/fixpoint.js"
import { streamNodeMake } from "../nodes/stream.js"

export const Edges = Schema.Struct({
  s: PrettyNumber,
  t: PrettyNumber
})
export type Edges = typeof Edges.Type

export const Reach = Schema.Struct({
  s: PrettyNumber,
  t: PrettyNumber
})

export type Reach = typeof Reach.Type

export const recursiveQueryOptimized = <K, W>(ring: Ring<W>) =>
(
  Se: Stream.Stream<IZSet<K, Edges, W>>
) =>
  bracketIntroElim<K, Edges, W>(
    fixPointNodeMake<K, Edges, W>()({
      fn: (Sr) =>
        endNodeMake<K, Edges, W>()({
          children: [
            deltaDistinctNodeMake<K, Edges, W>()({
              children: [
                addNodeMake<K, Edges, W>()({
                  children: [
                    deltaJoinNodeMake<K, Reach, Edges, Edges, W>()({
                      children: [
                        streamNodeMake<K, Edges, W>()({ stream: Sr, children: [] }),
                        streamNodeMake<K, Edges, W>()({ stream: Se, children: [] })
                      ],
                      fn: (a, b) =>
                        Edges.make({
                          s: a.s,
                          t: b.t
                        })
                    }),
                    streamNodeMake<K, Edges, W>()({ stream: Se, children: [] })
                  ]
                })
              ]
            })
          ]
        }),
      children: []
    })
  )
