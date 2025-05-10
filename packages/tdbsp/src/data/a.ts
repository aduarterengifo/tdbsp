import { Arbitrary, FastCheck, Schema } from "effect"

export const PrettyNumber = Schema.Int.pipe(Schema.between(0, 999))

export const BaseA = Schema.Struct({
  a: PrettyNumber,
  x: PrettyNumber,
  id: PrettyNumber
})

export type BaseA = typeof BaseA.Type

export const BaseAMap = BaseA.omit("a")
export type BaseAMap = typeof BaseAMap.Type

export const BaseAArbitrary = Arbitrary.make(BaseA)

export const sampleBaseA = (n: number): Array<[BaseA, string]> =>
  FastCheck.sample(BaseAArbitrary, n).map((x) => [
    x,
    Math.random().toString(36).substring(2, 15)
  ])
