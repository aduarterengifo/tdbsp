import { describe, expect, it } from "@effect/vitest"
import { HashMap as HM } from "effect"
import { equals } from "../../src/functions/i-z-set/binary/predicates/equals.js"
import { make } from "../../src/functions/i-z-set/make.js"
import { Z } from "../../src/objs/z.js"

describe("hashmap", () => {
  it("equals true", () => {
    const a = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 2]])],
      [2, HM.fromIterable([[3, 3]])],
      [3, HM.fromIterable([[3, 1]])]
    ]))
    expect(equals(Z)(a)(a)).toBe(true)
  })
  it("equals false", () => {
    const a = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 2]])],
      [2, HM.fromIterable([[3, 3]])],
      [3, HM.fromIterable([[3, 1]])]
    ]))
    const b = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 1]])],
      [3, HM.fromIterable([[3, -1]])]
    ]))

    expect(equals(Z)(a)(b)).toBe(false)
  })
})
