import { expect, it } from "@effect/vitest"
import { HashMap as HM } from "effect"
import { equals } from "../../../src/functions/i_z_set/binary/predicates/equals.js"
import { make } from "../../../src/functions/i_z_set/make.js"
import { index } from "../../../src/functions/i_z_set/unary/index.js"
import { Z } from "../../../src/objs/z.js"

it("index", () => {
  const a = make<0, number, number>(HM.fromIterable([
    [0, HM.fromIterable([[1, 2], [3, 4], [4, 4]])]
  ]))

  const result = index<number, number, number>((x) => x)(a)

  const expected = make<number, number, number>(HM.fromIterable([
    [1, HM.fromIterable([[1, 2]])],
    [3, HM.fromIterable([[3, 4]])],
    [4, HM.fromIterable([[4, 4]])]
  ]))

  // uncomment to debug
  // expect(result).toStrictEqual(expected)

  expect(equals(Z)(result)(expected)).toBe(true)
})
