import { describe, expect, it } from "@effect/vitest"
import { Chunk, Effect, HashMap as HM, Stream } from "effect"
import { make } from "../../src/functions/i-z-set/make.js"
import { equals } from "../../src/functions/streams/equals.js"
import { join } from "../../src/functions/streams/lifted-join.js"
import { Z } from "../../src/objs/z.js"

describe("stream lifted join", () => {
  it.effect("basic", () =>
    Effect.gen(function*() {
      const a = make<number, number, number>(HM.fromIterable([
        [2, HM.fromIterable([[3, 3]])],
        [3, HM.fromIterable([[3, 1]])]
      ]))
      const b = make<number, number, number>(HM.fromIterable([
        [1, HM.fromIterable([[1, 1]])],
        [4, HM.fromIterable([[4, 2]])],
        [3, HM.fromIterable([[3, -1]])]
      ]))

      const Sa = Stream.make(a, b)

      const c = make<number, number, number>(HM.fromIterable([
        [2, HM.fromIterable([[3, 3]])],
        [3, HM.fromIterable([[3, 1]])]
      ]))

      const d = make<number, number, number>(HM.fromIterable([
        [1, HM.fromIterable([[1, 1]])],
        [3, HM.fromIterable([[3, -1]])]
      ]))

      const Sb = Stream.make(c, d)

      const result = join<number, number, number, number, number>(Z)((a, b) => a + b)(Sb)(Sa)

      const expected = Stream.make(
        make<number, number, number>(HM.fromIterable([
          [2, HM.fromIterable([[6, 9]])],
          [3, HM.fromIterable([[6, 1]])]
        ])),
        make<number, number, number>(HM.fromIterable([
          [1, HM.fromIterable([[2, 1]])],
          [3, HM.fromIterable([[6, 1]])]
        ]))
      )
      const Se = equals(Z)(expected)(result)

      //   const SeChunk = Chunk.toReadonlyArray(yield* result.pipe(Stream.runCollect)).map((x) =>
      //     console.log(Array.from(x.index).map(([a, b]) => [a, Array.from(b)[0]]))
      //   )

      //   const SeChunk = yield* Se.pipe(Stream.runCollect)
      const SeAll = yield* Se.pipe(Stream.runFold(
        true,
        (acc, a) => acc && a
      ))

      expect(SeAll).toBe(true)
    }))
})
