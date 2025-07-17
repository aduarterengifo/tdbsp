import { describe, expect, it } from "@effect/vitest"
import { Chunk, Effect, HashMap as HM, pipe, Stream } from "effect"
import { diracDelta } from "../../src/functions/streams/dirac_delta.js"
import { Z } from "../../src/objs/z.js"

describe("dirac delta function", () => {
  it.effect("basic", () =>
    Effect.gen(function*() {
      const result = diracDelta(Z)(5)

      const result3 = Stream.take(result, 3)

      const result3Y = Chunk.toReadonlyArray(yield* Stream.runCollect(result3))

      expect(result3Y).toStrictEqual([5, 0, 0])
    }))
})
