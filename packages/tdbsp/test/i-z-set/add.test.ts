import { describe, expect, it } from "@effect/vitest"
import { HashMap as HM } from "effect"
import { add } from "../../src/functions/i_z_set/binary/add.js"
import { equals } from "../../src/functions/i_z_set/binary/predicates/equals.js"
import { make } from "../../src/functions/i_z_set/make.js"
import { Z } from "../../src/objs/z.js"

describe("add", () => {
  it("basic", () => {
    const a = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 2]])],
      [2, HM.fromIterable([[3, 3]])],
      [3, HM.fromIterable([[3, 1]])]
    ]))
    const b = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 1]])],
      [3, HM.fromIterable([[3, -1]])]
    ]))

    const result = add(Z)([a, b])

    const expected = make<number, number, number>(HM.fromIterable([
      [1, HM.fromIterable([[1, 3]])],
      [2, HM.fromIterable([[3, 3]])],
      [3, HM.fromIterable([])] // should go bye bye
    ]))

    expect(equals(Z)(result)(expected)).toBe(true)
  })
})
