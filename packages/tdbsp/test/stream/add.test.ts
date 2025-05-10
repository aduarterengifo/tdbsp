import { describe, expect, it } from "@effect/vitest"
import { Effect, HashMap as HM, Stream } from "effect"
import { make } from "../../src/functions/i-z-set/make.js"
import { equals } from "../../src/functions/streams/equals.js"
import { add } from "../../src/functions/streams/lifted-add.js"
import { Z } from "../../src/objs/z.js"

describe("stream lifted add", () => {
  it.effect("basic", () =>
    Effect.gen(function*() {
      const a = make<number, number, number>(HM.fromIterable([
        [1, HM.fromIterable([[1, 2]])],
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
        [1, HM.fromIterable([[1, 2]])],
        [2, HM.fromIterable([[3, 3]])],
        [3, HM.fromIterable([[3, 1]])]
      ]))

      const d = make<number, number, number>(HM.fromIterable([
        [1, HM.fromIterable([[1, 1]])],
        [3, HM.fromIterable([[3, -1]])]
      ]))

      const Sb = Stream.make(c, d)

      const result = add<number, number, number>(Z)(Sb)(Sa)

      const expected = Stream.make(
        make<number, number, number>(HM.fromIterable([
          [1, HM.fromIterable([[1, 4]])],
          [2, HM.fromIterable([[3, 6]])],
          [3, HM.fromIterable([[3, 2]])]
        ])),
        make<number, number, number>(HM.fromIterable([
          [1, HM.fromIterable([[1, 2]])],
          [4, HM.fromIterable([[4, 2]])],
          [3, HM.fromIterable([[3, -2]])]
        ]))
      )
      const Se = equals(Z)(expected)(result)

      //   const SeChunk = yield* Se.pipe(Stream.runCollect)
      const SeAll = yield* Se.pipe(Stream.runFold(
        true,
        (acc, a) => acc && a
      ))

      expect(SeAll).toBe(true)
    }))
})
