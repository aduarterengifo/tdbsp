import { expect, it } from "@effect/vitest"
import { HashMap as HM } from "effect"
import { except } from "../../src/functions/i-z-set/binary/except.js"
import { equals } from "../../src/functions/i-z-set/binary/predicates/equals.js"
import { make } from "../../src/functions/i-z-set/make.js"
import { Z } from "../../src/objs/z.js"

it("except", () => {
  const a = make<number, number, number>(HM.fromIterable([
    [1, HM.fromIterable([[1, 2]])],
    [2, HM.fromIterable([[3, 3]])],
    [3, HM.fromIterable([[3, 1]])]
  ]))

  const b = make<number, number, number>(HM.fromIterable([
    [1, HM.fromIterable([[1, 1]])],
    [3, HM.fromIterable([[3, -1]])]
  ]))

  const result = except(Z)([a, b])

  const expected = make<number, number, number>(HM.fromIterable([
    [1, HM.fromIterable([])],
    [2, HM.fromIterable([[3, 3]])],
    [3, HM.fromIterable([[3, 1]])] // should go bye bye
  ]))
  // debug
  // expect(result).toStrictEqual(expected)
  expect(equals(Z)(result)(expected)).toBe(true)
})
