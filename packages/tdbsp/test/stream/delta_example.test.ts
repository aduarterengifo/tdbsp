import { describe, expect, it } from "@effect/vitest"
import { Chunk, Data, Effect, HashMap as HM, Stream } from "effect"
import type { BaseA } from "../../src/data/a.js"
import type { BaseB } from "../../src/data/b.js"
import type { BaseJoined } from "../../src/data/c.js"
import { deltaCircuitExample } from "../../src/examples/delta/example.js"
import { make } from "../../src/functions/i_z_set/make.js"
import { equals } from "../../src/functions/streams/equals.js"
import { IZSetPretty } from "../../src/functions/streams/i_z_sets/utils.js"
import { sub } from "../../src/functions/streams/lifted_sub.js"
import { Z } from "../../src/objs/z.js"

describe("stream delta example circuit", () => {
  it.effect("basic", () =>
    Effect.gen(function*() {
      const a = make<number, BaseA, number>(HM.fromIterable([
        [
          0,
          HM.fromIterable([[
            Data.struct({
              a: 1,
              x: 2,
              id: 5
            }),
            1
          ], [
            Data.struct({
              a: 3,
              x: 2,
              id: 4
            }),
            1
          ]])
        ]
      ]))
      const b = make<number, BaseA, number>(HM.fromIterable([
        [
          0,
          HM.fromIterable([[
            Data.struct({
              a: 4,
              x: 1,
              id: 6
            }),
            1
          ]])
        ]
      ]))

      const Sa = Stream.make(a, b)

      const c = make<number, BaseB, number>(HM.fromIterable([
        [
          0,
          HM.fromIterable([[
            Data.struct({
              s: 4,
              y: 2,
              id: 1
            }),
            1
          ], [
            Data.struct({
              s: 6,
              y: 3,
              id: 4
            }),
            1
          ]])
        ]
      ]))

      const d = make<number, BaseB, number>(HM.fromIterable([
        [
          0,
          HM.fromIterable([[
            Data.struct({
              s: 8,
              y: 5,
              id: 6
            }),
            1
          ]])
        ]
      ]))

      const Sb = Stream.make(c, d)

      const result = yield* deltaCircuitExample<number, BaseA, BaseB, number>(Z)(Sa, Sb)

      const expected = Stream.make(
        make<number, BaseJoined, number>(HM.fromIterable([
          [
            4,
            HM.fromIterable([[
              Data.struct({
                x: 2,
                y: 3
              }),
              1
            ]])
          ]
        ])),
        make<number, BaseJoined, number>(HM.fromIterable([
          [
            6,
            HM.fromIterable([[
              Data.struct({
                x: 1,
                y: 5
              }),
              1
            ]])
          ]
        ]))
      )
      const Se = equals(Z)(expected)(result)

      const resArr = Chunk.toReadonlyArray(yield* Stream.runCollect(result))

      const expectedArr = Chunk.toReadonlyArray(yield* Stream.runCollect(expected))

      // expect(resChunk).toStrictEqual(expectedChunk)

      // Chunk.toReadonlyArray(yield* result.pipe(Stream.runCollect)).map((x) =>
      //   console.log(Array.from(x.index).map(([a, b]) => [a, Array.from(b)[0]]))
      // )

      const SeChunk = yield* Se.pipe(Stream.runCollect)
      const subChunk = Chunk.toReadonlyArray(yield* sub(Z)(expected)(result).pipe(Stream.runCollect))

      console.log("res 0", IZSetPretty(resArr[0]))
      console.log("exp 0", IZSetPretty(expectedArr[0]))
      console.log("res 1", IZSetPretty(resArr[1]))
      console.log("exp 1", IZSetPretty(expectedArr[1]))
      console.log("eq", SeChunk)
      console.log("sub", Array.from(subChunk[0].index).map((x) => Array.from(x[1]).map((x) => x[0])))
      const SeAll = yield* Se.pipe(Stream.runFold(
        true,
        (acc, a) => acc && a
      ))

      expect(SeAll).toBe(true)
    }))
})
