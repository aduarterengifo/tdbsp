import { describe, expect, it } from "@effect/vitest"
import { HashMap as HM } from "effect"
import { mul } from "../../src/functions/i_z_set/binary/mul.js"
import { equals } from "../../src/functions/i_z_set/binary/predicates/equals.js"
import { make } from "../../src/functions/i_z_set/make.js"
import { Z } from "../../src/objs/z.js"

describe("hashmap", () => {
  it("mul", () => {
    const a = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 2]])],
      [2, HM.fromIterable([[3, 3]])],
      [3, HM.fromIterable([[3, 1]])]
    ]))
    const b = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 1]])],
      [3, HM.fromIterable([[3, -1]])]
    ]))

    const result = mul<number, number, number>(Z)((x: number, y: number) => x + y)(a)(b)

    const expected = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[2, 2]])],
      [2, HM.fromIterable([[3, 3]])],
      [3, HM.fromIterable([[6, -1]])]
    ]))

    expect(result).toStrictEqual(expected)

    expect(equals(Z)(result)(expected)).toBe(true)
  })
})
