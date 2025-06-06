import { describe, expect, it } from "@effect/vitest"
import type { BaseA } from "../../src/data/a.js"
import { Sa } from "../../src/data/streams/input.js"
import { prop45Expectation, prop45Input } from "../../src/functions/streams/graph/examples/prop_45_target.js"
import { simplProp45 } from "../../src/functions/streams/graph/incrementalize.js"
import { softTreeEquality } from "../../src/functions/streams/graph/soft_equality.js"

describe("stream delta example circuit", () => {
  it("basic", () => {
    const input = prop45Input(Sa)

    const result = simplProp45<number, BaseA, number>(input)

    const expectation = prop45Expectation(Sa)

    expect(softTreeEquality(result)(expectation)).toBe(true)
    // expect(result).toStrictEqual(expectation)
  })
})
