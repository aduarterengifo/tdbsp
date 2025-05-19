import { describe, expect, it } from "@effect/vitest"
import { Effect, Stream } from "effect"
import { integralAprox } from "../../src/functions/streams/integral_aprox.js"
import { Z } from "../../src/objs/z.js"

describe("stream integral approx", () => {
  it.effect("basic", () =>
    Effect.gen(function*() {
      const result = yield* integralAprox<number>(Z)(Stream.fromIterable([5, 5, 9, -5, 3, 0, 0, 0, 0, 0, 6]))

      expect(result).toBe(17)
    }))
})
