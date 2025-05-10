import { describe, expect, it } from "@effect/vitest"
import { HashMap as HM } from "effect"
import { equals } from "../../src/functions/i-z-set/binary/predicates/equals.js"
import { make } from "../../src/functions/i-z-set/make.js"
import { negate } from "../../src/functions/i-z-set/unary/negate.js"
import { Z } from "../../src/objs/z.js"

describe("hashmap", () => {
  it("negate", () => {
    const a = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 2]])],
      [2, HM.fromIterable([[3, 3]])],
      [3, HM.fromIterable([[3, 1]])]
    ]))

    const result = negate(Z)(a)

    const expected = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, -2]])],
      [2, HM.fromIterable([[3, -3]])],
      [3, HM.fromIterable([[3, -1]])] // should go bye bye
    ]))

    expect(equals(Z)(result)(expected)).toBe(true)
  })
})
