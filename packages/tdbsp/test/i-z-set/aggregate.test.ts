import { describe, expect, it } from "@effect/vitest"
import { HashMap as HM } from "effect"
import { equals } from "../../src/functions/i-z-set/binary/predicates/equals.js"
import { make } from "../../src/functions/i-z-set/make.js"
import { aggregate } from "../../src/functions/i-z-set/unary/aggregate.js"
import { Z } from "../../src/objs/z.js"

describe("hashmap", () => {
  it("aggregate", () => {
    const a = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 2], [3, 4]])],
      [2, HM.fromIterable([[3, 3], [5, 2], [6, 4]])],
      [3, HM.fromIterable([[3, 1]])]
    ]))

    const result = aggregate<number, number, number, number, number>(Z)(0, (acc, w, _) => Z.add(acc, w), (x) => x)(a)

    const expected = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[6, 1]])],
      [2, HM.fromIterable([[9, 1]])],
      [3, HM.fromIterable([[1, 1]])] // should go bye bye
    ]))

    expect(equals(Z)(result)(expected)).toBe(true)
  })
})
