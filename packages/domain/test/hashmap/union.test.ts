import { describe, expect, it } from "@effect/vitest"
import { HashMap } from "effect"

describe("hashmap", () => {
  it("union", () => {
    const a = HashMap.fromIterable([
      [1, "chicken"]
    ])
    const b = HashMap.fromIterable([
      [1, "cow"]
    ])
    const union = HashMap.union(a, b)
    const expected = HashMap.fromIterable([[1, "cow"]])

    expect(union).toStrictEqual(expected)
  })
})
