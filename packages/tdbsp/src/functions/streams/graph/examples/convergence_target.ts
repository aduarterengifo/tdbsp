import type { Stream } from "effect"
import type { BaseA } from "../../../../data/a.js"
import type { IZSet } from "../../../../objs/i_z_set.js"
import { distinctNodeMake } from "../nodes/distinct.js"
import { endNodeMake } from "../nodes/end.js"
import { filterNodeMake } from "../nodes/filter.js"
import { streamNodeMake } from "../nodes/stream.js"

export const ConvergenceInput = <K0, D0 extends BaseA, W>(
  Sa: Stream.Stream<IZSet<K0, D0, W>>
) =>
  endNodeMake<K0, D0, W>()({
    children: [
      filterNodeMake<K0, D0, W>()({
        fn: () => true,
        children: [
          distinctNodeMake<K0, D0, W>()({
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
        ]
      })
    ]
  })

// we keep kicking distinct down the road.
export const ConvergenceExpectation = <K0, D0 extends BaseA, W>(
  Sa: Stream.Stream<IZSet<K0, D0, W>>
) =>
  endNodeMake<K0, D0, W>()({
    children: [
      distinctNodeMake<K0, D0, W>()({
        children: [
          filterNodeMake<K0, D0, W>()({
            fn: () => true,
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
    ]
  })
