import { describe, expect, it } from "@effect/vitest"
import { HashMap as HM, Option } from "effect"
import { merge } from "../../src/functions/hashmap/merge.js"

describe("hashmap", () => {
  it("merge", () => {
    const a = HM.fromIterable([
      [1, "chicken"],
      [2, "bull"]
    ])
    const b = HM.fromIterable([
      [1, "cow"]
    ])

    const func = (a: Option.Option<string>, b: Option.Option<string>) =>
      Option.match(a, {
        onSome: (a) =>
          Option.match(b, {
            onSome: (b) => a + b,
            onNone: () => a
          }),
        onNone: () => Option.getOrElse(b, () => "")
      })

    const union = merge(func)(a)(b)
    const expected = HM.fromIterable([[1, "cowchicken"], [2, "bull"]])

    expect(union).toStrictEqual(expected)
  })
})
