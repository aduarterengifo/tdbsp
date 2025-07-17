import { describe, expect, it } from "@effect/vitest"
import { Chunk, Data, Effect, HashMap as HM, pipe, Stream } from "effect"
import { make } from "../../src/functions/i_z_set/make.js"
import { equals } from "../../src/functions/streams/equals.js"
import type { Edges } from "../../src/functions/streams/graph/examples/recursive_query.js"
import { recursiveQueryOptimized } from "../../src/functions/streams/graph/examples/recursive_semi_naive_query.js"
import { execMemo } from "../../src/functions/streams/graph/exec.js"
import { Z } from "../../src/objs/z.js"

describe("recursive query transitive closure", () => {
  it.effect("basic", () =>
    Effect.gen(function*() {
      yield* Effect.log("Hello, world!")

      //

      const edgesStream = Stream.fromIterable([
        make<number, Edges, number>(HM.fromIterable([
          [
            0,
            HM.fromIterable([
              [
                Data.struct({
                  s: 0,
                  t: 1
                }),
                1
              ],
              [
                Data.struct({
                  s: 1,
                  t: 2
                }),
                1
              ]
            ])
          ]
        ])),
        make<number, Edges, number>(HM.fromIterable([
          [
            0,
            HM.fromIterable([
              [
                Data.struct({
                  s: 0,
                  t: 1
                }),
                1
              ],
              [
                Data.struct({
                  s: 1,
                  t: 2
                }),
                1
              ],
              [
                Data.struct({
                  s: 1,
                  t: 3
                }),
                1
              ]
            ])
          ]
        ]))
      ])

      const result = yield* pipe(
        recursiveQueryOptimized<number, number>(Z)(edgesStream),
        execMemo(Z)
      )

      const expected = Stream.fromIterable([
        make<number, Edges, number>(HM.fromIterable([
          [
            0,
            HM.fromIterable([
              [
                Data.struct({
                  s: 0,
                  t: 1
                }),
                1
              ],
              [
                Data.struct({
                  s: 1,
                  t: 2
                }),
                1
              ],
              [
                Data.struct({
                  s: 0,
                  t: 2
                }),
                1
              ]
            ])
          ]
        ])),
        make<number, Edges, number>(HM.fromIterable([
          [
            0,
            HM.fromIterable([
              [
                Data.struct({
                  s: 0,
                  t: 1
                }),
                1
              ],
              [
                Data.struct({
                  s: 1,
                  t: 2
                }),
                1
              ],
              [
                Data.struct({
                  s: 1,
                  t: 3
                }),
                1
              ],
              [
                Data.struct({
                  s: 0,
                  t: 2
                }),
                1
              ],
              [
                Data.struct({
                  s: 0,
                  t: 3
                }),
                1
              ]
            ])
          ]
        ]))
      ])

      const Se = equals(Z)(expected)(result)

      const resArr = Chunk.toReadonlyArray(yield* Stream.runCollect(result))

      const expectedArr = Chunk.toReadonlyArray(yield* Stream.runCollect(expected))

      expect(resArr).toStrictEqual(expectedArr)

      const SeAll = yield* Se.pipe(Stream.runFold(
        true,
        (acc, a) => acc && a
      ))

      expect(SeAll).toBe(true)
    }))
})
