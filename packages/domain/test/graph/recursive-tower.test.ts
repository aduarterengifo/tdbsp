import { describe, expect, it } from "@effect/vitest"
import { recursiveTower, recursiveTowerNodes } from "../../src/functions/streams/graph/spec.js"

describe("recursive tower", () => {
  it("basic tags", () => {
    const result = recursiveTower(["end", "distinct", "filter", "map", "mul"])

    const expected = {
      _tag: "end",
      children: [
        {
          _tag: "distinct",
          children: [
            {
              _tag: "filter",
              children: [
                {
                  _tag: "map",
                  children: [
                    {
                      _tag: "mul",
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
    expect(result).toStrictEqual(expected)
  })
  it("basic nodes", () => {
    const result = recursiveTowerNodes([
      {
        _tag: "end",
        children: []
      },
      {
        _tag: "distinct",
        children: []
      },
      {
        _tag: "filter",
        children: [],
        fn: () => {}
      },
      {
        _tag: "map",
        children: [],
        fn: () => {}
      },
      {
        _tag: "mul",
        children: []
      }
    ])
    const expected = {
      _tag: "end",
      children: [
        {
          _tag: "distinct",
          children: [
            {
              _tag: "filter",
              children: [
                {
                  _tag: "map",
                  children: [
                    {
                      _tag: "mul",
                      children: []
                    }
                  ],
                  fn: () => {}
                }
              ],
              fn: () => {}
            }
          ]
        }
      ]
    }
    expect(result).toStrictEqual(expected)
  })
})
