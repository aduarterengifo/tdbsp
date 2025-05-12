import { describe, expect, it } from "@effect/vitest"
import { Chunk, Data, Effect, HashMap as HM, pipe, Stream } from "effect"
import type { BaseJoined } from "../../src/data/c.js"
import { Sa, Sb } from "../../src/data/streams/input.js"
import { make } from "../../src/functions/i_z_set/make.js"
import { equals } from "../../src/functions/streams/equals.js"
import { egStaticTree } from "../../src/functions/streams/graph/examples/static_tree.js"
import { exec } from "../../src/functions/streams/graph/exec.js"
import { IZSetPretty } from "../../src/functions/streams/i_z_sets/utils.js"
import { sub } from "../../src/functions/streams/lifted_sub.js"
import { Z } from "../../src/objs/z.js"

describe("stream delta example circuit", () => {
  it.effect("basic", () =>
    Effect.gen(function*() {
      // const resultOld = yield* deltaCircuitExample<number, BaseA, BaseB, number>(Z)(Sa, Sb)

      const result = pipe(
        egStaticTree(Sa, Sb),
        exec(Z)
      )

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
