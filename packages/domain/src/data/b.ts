import { Arbitrary, FastCheck, Schema } from "effect"
import { PrettyNumber } from "./a.js"

export const BaseB = Schema.Struct({
  s: PrettyNumber,
  y: PrettyNumber,
  id: PrettyNumber
})

export type BaseB = typeof BaseB.Type

export const BaseBArbitrary = Arbitrary.make(BaseB)

export const sampleBaseB = (n: number): Array<[BaseB, string]> =>
  FastCheck.sample(BaseBArbitrary, n).map((x) => [
    x,
    Math.random().toString(36).substring(2, 15)
  ])
