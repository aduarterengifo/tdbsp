import { describe, expect, it } from "@effect/vitest"
import type { BaseA } from "../../src/data/a.js"
import { Sa } from "../../src/data/streams/input.js"
import { prop44Expectation, prop44Input } from "../../src/functions/streams/graph/examples/prop_44_target.js"
import { simplProp44 } from "../../src/functions/streams/graph/incrementalize.js"
import { softTreeEquality } from "../../src/functions/streams/graph/soft_equality.js"

describe("stream delta example circuit", () => {
  it("basic", () => {
    const input = prop44Input(Sa)
    const result = simplProp44<number, BaseA, number>(input)
    const expectation = prop44Expectation(Sa)

    expect(softTreeEquality(result)(expectation)).toBe(true)
  })
})
