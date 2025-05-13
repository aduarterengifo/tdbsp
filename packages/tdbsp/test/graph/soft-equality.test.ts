import { describe, expect, it } from "@effect/vitest"
import type { BaseA } from "../../src/data/a.js"
import { Sa } from "../../src/data/streams/input.js"
import { distinctNodeMake } from "../../src/functions/streams/graph/nodes/distinct.js"
import { endNodeMake } from "../../src/functions/streams/graph/nodes/end.js"
import { mulNodeMake } from "../../src/functions/streams/graph/nodes/mul.js"
import { streamNodeMake } from "../../src/functions/streams/graph/nodes/stream.js"
import { softTreeEquality } from "../../src/functions/streams/graph/soft_equality.js"

describe("soft tree equality", () => {
  it("failure", () => {
    const a = endNodeMake<number, BaseA, number>()({
      children: [
        mulNodeMake<number, BaseA, number>()({
          fn: (d) => d,
          children: [
            distinctNodeMake<number, BaseA, number>()({
              children: [
                streamNodeMake<number, BaseA, number>()({
                  stream: Sa,
                  children: []
                })
              ]
            }),
            distinctNodeMake<number, BaseA, number>()({
              children: [
                streamNodeMake<number, BaseA, number>()({
                  stream: Sa,
                  children: []
                })
              ]
            })
          ]
        })
      ]
    })

    const b = endNodeMake<number, BaseA, number>()({
      children: [
        mulNodeMake<number, BaseA, number>()({
          fn: (d) => d,
          children: [
            streamNodeMake<number, BaseA, number>()({
              stream: Sa,
              children: []
            }),
            distinctNodeMake<number, BaseA, number>()({
              children: [
                streamNodeMake<number, BaseA, number>()({
                  stream: Sa,
                  children: []
                })
              ]
            })
          ]
        })
      ]
    })

    expect(softTreeEquality(a)(b)).not.toBe(true)
  })
  it("success", () => {
    const a = endNodeMake<number, BaseA, number>()({
      children: [
        mulNodeMake<number, BaseA, number>()({
          fn: (d) => d,
          children: [
            distinctNodeMake<number, BaseA, number>()({
              children: [
                streamNodeMake<number, BaseA, number>()({
                  stream: Sa,
                  children: []
                })
              ]
            }),
            distinctNodeMake<number, BaseA, number>()({
              children: [
                streamNodeMake<number, BaseA, number>()({
                  stream: Sa,
                  children: []
                })
              ]
            })
          ]
        })
      ]
    })

    expect(softTreeEquality(a)(a)).toBe(true)
  })
})
