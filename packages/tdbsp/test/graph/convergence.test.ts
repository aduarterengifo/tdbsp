import { describe, expect, it } from "@effect/vitest"
import type { BaseA } from "../../src/data/a.js"
import { Sa } from "../../src/data/streams/input.js"
import {
  ConvergenceExpectation,
  ConvergenceInput
} from "../../src/functions/streams/graph/examples/convergence_target.js"
import { simplifyUntilConvergence } from "../../src/functions/streams/graph/incrementalize.js"
import { softTreeEquality } from "../../src/functions/streams/graph/soft_equality.js"

describe("convergence", () => {
  it("basic", () => {
    const input = ConvergenceInput(Sa)
    const result = simplifyUntilConvergence<number, BaseA, number>(input)
    const expectation = ConvergenceExpectation(Sa)

    expect(softTreeEquality(result)(expectation)).toBe(true)
  })
})
