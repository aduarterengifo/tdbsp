import { describe, expect, it } from "@effect/vitest"
import type { BaseA } from "../../src/data/a.js"
import { Sa } from "../../src/data/streams/input.js"
import { prop45Expectation, prop45Input } from "../../src/functions/streams/graph/examples/prop_45_target.js"
import { runProp45 } from "../../src/functions/streams/graph/incrementalize.js"
import { Z } from "../../src/objs/z.js"

describe("stream delta example circuit", () => {
  it("basic", () => {
    const prop45Tree = runProp45<number, BaseA, number>(Z)(prop45Input(Sa))

    expect(prop45Tree).toStrictEqual(prop45Expectation(Sa))
  })
})
