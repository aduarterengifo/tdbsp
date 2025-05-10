import { expect, it } from "@effect/vitest"
import { HashMap as HM } from "effect"
import { equals } from "../../src/functions/i_z_set/binary/predicates/equals.js"
import { make } from "../../src/functions/i_z_set/make.js"
import { filter } from "../../src/functions/i_z_set/unary/filter.js"
import { Z } from "../../src/objs/z.js"

it("filter", () => {
  const a = make<number, number, number>(HM.fromIterable([
    [1, HM.fromIterable([[1, 2]])],
    [2, HM.fromIterable([[3, 3]])],
    [3, HM.fromIterable([[3, 1]])]
  ]))

  const result = filter((w: number, data: number) => data > 2)(a)

  const expected = make<number, number, number>(HM.fromIterable([
    [1, HM.fromIterable([])],
    [2, HM.fromIterable([[3, 3]])],
    [3, HM.fromIterable([[3, 1]])]
  ]))

  // uncomment to debug
  // expect(result).toStrictEqual(expected)

  expect(equals(Z)(result)(expected)).toBe(true)
})
