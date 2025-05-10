import { describe, expect, it } from "@effect/vitest"
import { Data, HashMap } from "effect"
import { equals } from "../../src/functions/i_z_set/binary/predicates/equals.js"
import { make } from "../../src/functions/i_z_set/make.js"
import { positive } from "../../src/functions/i_z_set/unary/positive.js"
import { Z } from "../../src/objs/z.js"

describe("iZset", () => {
  it("positive", () => {
    const input = make<number, { x: number; y: number }, number>(
      HashMap.fromIterable([
        [
          1,
          HashMap.fromIterable([
            [Data.struct({ x: 1, y: 1 }), 3],
            [Data.struct({ x: 5, y: 5 }), 4],
            [Data.struct({ x: 4, y: 7 }), -1]
          ])
        ],
        [
          2,
          HashMap.fromIterable([
            [Data.struct({ x: 7, y: 6 }), 1],
            [Data.struct({ x: 1, y: 10 }), 5],
            [Data.struct({ x: 1, y: 1 }), -5]
          ])
        ],
        [
          3,
          HashMap.fromIterable([
            [Data.struct({ x: 3, y: 2 }), 1],
            [Data.struct({ x: 12, y: 1 }), 0],
            [Data.struct({ x: 1, y: 19 }), 10]
          ])
        ]
      ])
    )

    const expected = make<number, { x: number; y: number }, number>(
      HashMap.fromIterable([
        [
          1,
          HashMap.fromIterable([
            [Data.struct({ x: 1, y: 1 }), 3],
            [Data.struct({ x: 5, y: 5 }), 4]
          ])
        ],
        [
          2,
          HashMap.fromIterable([
            [Data.struct({ x: 7, y: 6 }), 1],
            [Data.struct({ x: 1, y: 10 }), 5]
          ])
        ],
        [
          3,
          HashMap.fromIterable([
            [Data.struct({ x: 3, y: 2 }), 1],
            [Data.struct({ x: 1, y: 19 }), 10]
          ])
        ]
      ])
    )

    const result = positive(Z)(input)

    // uncomment to debug
    // expect(result).toStrictEqual(expected)

    expect(equals(Z)(result)(expected)).toBe(true)
  })
})
