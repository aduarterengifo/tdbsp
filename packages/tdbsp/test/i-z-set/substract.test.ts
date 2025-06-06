import { describe, expect, it } from "@effect/vitest"
import { HashMap as HM } from "effect"
import { equals } from "../../src/functions/i_z_set/binary/predicates/equals.js"
import { sub } from "../../src/functions/i_z_set/binary/sub.js"
import { make } from "../../src/functions/i_z_set/make.js"
import { Z } from "../../src/objs/z.js"

describe("sub", () => {
  it("different", () => {
    const a = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 2]])],
      [2, HM.fromIterable([[3, 3]])],
      [3, HM.fromIterable([[3, 1]])]
    ]))
    const b = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 1]])],
      [3, HM.fromIterable([[3, -1]])]
    ]))

    const result = sub(Z)([a, b])

    const expected = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 1]])],
      [2, HM.fromIterable([[3, 3]])],
      [3, HM.fromIterable([[3, 2]])]
    ]))
    // debug
    // expect(result).toStrictEqual(expected)
    expect(equals(Z)(result)(expected)).toBe(true)
  })
  it("same", () => {
    const a = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 2]])],
      [2, HM.fromIterable([[3, 3]])],
      [3, HM.fromIterable([[3, 1]])]
    ]))

    const result = sub(Z)([a, a])

    const expected = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([])],
      [2, HM.fromIterable([])],
      [3, HM.fromIterable([])]
    ]))

    expect(equals(Z)(result)(expected)).toBe(true)
  })
})
