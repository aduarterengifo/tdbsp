import type { Stream } from "effect"
import type { BaseA } from "../../../../data/a.js"
import type { IZSet } from "../../../../objs/i_z_set.js"
import { fixPoint } from "../fixpoint.js"
import { addNodeMake } from "../nodes/add.js"
import { endNodeMake } from "../nodes/end.js"
import { fixPointNodeMake } from "../nodes/fixpoint.js"
import { streamNodeMake } from "../nodes/stream.js"

export const recursiveAddTree = <K, W>(
  Sa: Stream.Stream<IZSet<K, BaseA, W>>
) =>
  fixPoint<K, BaseA, W>((Sa2) =>
    endNodeMake<K, BaseA, W>()({
      children: [
        addNodeMake<K, BaseA, W>()({
          children: [
            streamNodeMake<K, BaseA, W>()({
              stream: Sa,
              children: []
            }),
            Sa2
          ]
        })
      ]
    })
  )

export const recursiveAddTree2 = <K, T, W>(
  Sa: Stream.Stream<IZSet<K, T, W>>
) =>
  fixPointNodeMake<K, T, W>()({
    streams: [Sa],
    fn: (delayedStream) =>
      endNodeMake<K, T, W>()({
        children: [
          addNodeMake<K, T, W>()({
            children: [
              streamNodeMake<K, T, W>()({
                stream: Sa,
                children: []
              }),
              streamNodeMake<K, T, W>()({
                stream: delayedStream,
                children: []
              })
            ]
          })
        ]
      }),
    children: []
  })
