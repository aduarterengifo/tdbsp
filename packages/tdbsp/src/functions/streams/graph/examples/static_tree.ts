import type { Stream } from "effect"
import { Data } from "effect"
import type { BaseA, BaseAMap } from "../../../../data/a.js"
import type { BaseB, BaseBMap } from "../../../../data/b.js"
import type { BaseJoined } from "../../../../data/c.js"
import type { IZSet } from "../../../../objs/i_z_set.js"
import { deIndexNodeMake } from "../nodes/de_index.js"
import { endNodeMake } from "../nodes/end.js"
import { filterNodeMake } from "../nodes/filter.js"
import { indexNodeMake } from "../nodes/index.js"
import { joinNodeMake } from "../nodes/join.js"
import { mapNodeMake } from "../nodes/map.js"
import { streamNodeMake } from "../nodes/stream.js"

// I have my abstract syntax tree and from it I want to in the end get a stream.
export const egStaticTree = <K0, D0 extends BaseA, D1 extends BaseB, W>(
  Sa: Stream.Stream<IZSet<K0, D0, W>>,
  Sb: Stream.Stream<IZSet<K0, D1, W>>
) =>
  endNodeMake<number, BaseJoined, W>()({
    children: [
      joinNodeMake<number, BaseAMap, BaseBMap, BaseJoined, W>()({
        fn: ({ x }, { y }) => Data.struct({ x, y }),
        children: [
          indexNodeMake<K0, number, BaseAMap, W>()({
            fn: ({ id }) => id,
            children: [
              deIndexNodeMake<K0, BaseAMap, W>()({
                children: [
                  mapNodeMake<K0, D0, BaseAMap, W>()({
                    fn: ({ id, x }) =>
                      Data.struct({
                        x,
                        id
                      }),
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
          }),
          indexNodeMake<K0, number, BaseBMap, W>()({
            fn: ({ id }) => id,
            children: [
              deIndexNodeMake<K0, BaseBMap, W>()({
                children: [
                  mapNodeMake<K0, D1, BaseBMap, W>()({
                    fn: ({ id, y }) =>
                      Data.struct({
                        y,
                        id
                      }),
                    children: [
                      filterNodeMake<K0, D1, W>()({
                        fn: (_, { s }) => s > 5,
                        children: [
                          streamNodeMake<K0, D1, W>()({
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
      })
    ]
  })
