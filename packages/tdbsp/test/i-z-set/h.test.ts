import { describe, expect, it } from "@effect/vitest"
import { HashMap as HM } from "effect"
import { add } from "../../src/functions/i_z_set/binary/add.js"
import { h } from "../../src/functions/i_z_set/binary/h.js"
import { equals } from "../../src/functions/i_z_set/binary/predicates/equals.js"
import { make } from "../../src/functions/i_z_set/make.js"
import { Z } from "../../src/objs/z.js"

describe("h", () => {
  it("basic", () => {
    const i = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 2]])],
      [2, HM.fromIterable([[3, 3]])],
      [3, HM.fromIterable([[3, 1]])]
    ]))
    const d = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 1]])],
      [3, HM.fromIterable([[3, -1]])]
    ]))

    const iPlusD = add(Z)([i, d])

    const iPlusDExpected = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 3]])],
      [2, HM.fromIterable([[3, 3]])]
    ]))

    expect(equals(Z)(iPlusD)(iPlusDExpected)).toStrictEqual(true)

    const result = h<number, number, number>(Z)(d)(i)

    const expected = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([])],
      [2, HM.fromIterable([])],
      [3, HM.fromIterable([[3, -1]])]
    ]))

    // uncomment to debug
    // expect(result).toStrictEqual(expected)

    expect(equals(Z)(result)(expected)).toBe(true)
  })
})
