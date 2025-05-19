import { describe, expect, it } from "@effect/vitest"
import { Chunk, Data, Effect, HashMap as HM, pipe, Stream } from "effect"
import type { BaseJoined } from "../../src/data/c.js"
import { Sa, Sb } from "../../src/data/streams/input.js"
import { make } from "../../src/functions/i_z_set/make.js"
import { equals } from "../../src/functions/streams/equals.js"
import { egIncrementalTree } from "../../src/functions/streams/graph/examples/incremetal_tree.js"
import { exec } from "../../src/functions/streams/graph/exec.js"
import { Z } from "../../src/objs/z.js"

describe("exec delta circuit", () => {
  it.effect("basic", () =>
    Effect.gen(function*() {
      // const resultOld = yield* deltaCircuitExample<number, BaseA, BaseB, number>(Z)(Sa, Sb)

      const result = pipe(
        egIncrementalTree(Z)(Sa, Sb),
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

      expect(resArr).toStrictEqual(expectedArr)

      const SeAll = yield* Se.pipe(Stream.runFold(
        true,
        (acc, a) => acc && a
      ))

      expect(SeAll).toBe(true)
    }))
})
