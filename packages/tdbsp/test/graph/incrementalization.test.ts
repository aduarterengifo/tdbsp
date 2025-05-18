import { describe, expect, it } from "@effect/vitest"
import type { BaseA } from "../../src/data/a.js"
import type { BaseB } from "../../src/data/b.js"
import { Sa, Sb } from "../../src/data/streams/input.js"
import {
  egIncrementalTree,
  egIncrementalTreeExpectation
} from "../../src/functions/streams/graph/examples/incremetal_tree.js"
import { softTreeEquality } from "../../src/functions/streams/graph/soft_equality.js"
import { Z } from "../../src/objs/z.js"

describe("incrementalization", () => {
  it("basic", () => {
    const result = egIncrementalTree<number, BaseA, BaseB, number>(Z)(Sa, Sb)
    const expectation = egIncrementalTreeExpectation(Sa, Sb)

    expect(softTreeEquality(result)(expectation)).toBe(true)
  })
})
