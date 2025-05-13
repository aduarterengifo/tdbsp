import type { Stream } from "effect"
import type { BaseA } from "../../../../data/a.js"
import type { IZSet } from "../../../../objs/i_z_set.js"
import { distinctNodeMake } from "../nodes/distinct.js"
import { endNodeMake } from "../nodes/end.js"
import { filterNodeMake } from "../nodes/filter.js"
import { streamNodeMake } from "../nodes/stream.js"

// I have my abstract syntax tree and from it I want to in the end get a stream.
export const prop44Input = <K0, D0 extends BaseA, W>(
  Sa: Stream.Stream<IZSet<K0, D0, W>>
) =>
  endNodeMake<K0, D0, W>()({
    children: [
      filterNodeMake<K0, D0, W>()({
        fn: (_, { a }) => a > 2,
        children: [
          distinctNodeMake<K0, D0, W>()({
            children: [
              streamNodeMake<K0, D0, W>()({
                stream: Sa,
                children: []
              })
            ]
          })
        ]
      })
    ]
  })

export const prop44Expectation = <K0, D0 extends BaseA, W>(
  Sa: Stream.Stream<IZSet<K0, D0, W>>
) =>
  endNodeMake<K0, D0, W>()({
    children: [
      distinctNodeMake<K0, D0, W>()({
        children: [
          filterNodeMake<K0, D0, W>()({
            fn: (_, { a }) => a > 2,
            children: [
              streamNodeMake<K0, D0, W>()({
                stream: Sa,
                children: []
              })
            ]
          })
        ]
      })
    ]
  })
