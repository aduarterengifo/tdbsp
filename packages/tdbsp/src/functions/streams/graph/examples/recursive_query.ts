import type { Schema, Stream } from "effect"
import { children } from "effect/Fiber"
import { PrettyNumber } from "../../../../data/a.js"
import type { IZSet } from "../../../../objs/i_z_set.js"
import type { Ring } from "../../../../objs/ring.js"
import { bracketID, bracketIntroElim } from "../bracket.js"
import { fixPoint } from "../fixpoint.js"
import { addNodeMake } from "../nodes/add.js"
import { distinctNodeMake } from "../nodes/distinct.js"
import { endNodeMake } from "../nodes/end.js"
import { fixPointNodeMake } from "../nodes/fixpoint.js"
import { joinNodeMake } from "../nodes/join.js"
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

// transitive closure
export const recursiveQuery = <K, W>(ring: Ring<W>) =>
(
  Se: Stream.Stream<IZSet<K, Edges, W>>
) =>
  bracketIntroElim<K, Edges, W>(
    bracketID<K, Edges, W>(
      fixPointNodeMake<K, Edges, W>()({
        fn: (Sr) =>
          endNodeMake<K, Edges, W>()({
            children: [
              distinctNodeMake<K, Edges, W>()({
                children: [
                  addNodeMake<K, Edges, W>()({
                    children: [
                      joinNodeMake<K, Reach, Edges, Edges, W>()({
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
  )
