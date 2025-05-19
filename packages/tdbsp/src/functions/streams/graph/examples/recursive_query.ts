import type { Stream } from "effect"
import { Schema } from "effect"
import { children } from "effect/Fiber"
import { PrettyNumber } from "../../../../data/a.js"
import type { IZSet } from "../../../../objs/i_z_set.js"
import type { Ring } from "../../../../objs/ring.js"
import { fixPoint } from "../fixpoint.js"
import { addNodeMake } from "../nodes/add.js"
import { distinctNodeMake } from "../nodes/distinct.js"
import { endNodeMake } from "../nodes/end.js"
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

export const recursiveQuery = <K, W>(ring: Ring<W>) =>
(
  Se: Stream.Stream<IZSet<K, Edges, W>>
) =>
  fixPoint<K, Edges, W>((Sr) =>
    endNodeMake<K, Edges, W>()({
      children: [
        distinctNodeMake<K, Edges, W>()({
          children: [
            addNodeMake<K, Edges, W>()({
              children: [
                joinNodeMake<K, Reach, Edges, Edges, W>()({
                  children: [
                    Sr,
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
    })
  )
