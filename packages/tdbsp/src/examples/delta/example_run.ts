import { Effect, HashMap as HM, Logger, LogLevel, Stream } from "effect"
import { BaseA } from "../../data/a.js"
import { BaseB } from "../../data/b.js"
import { make } from "../../functions/i_z_set/make.js"
import { Z } from "../../objs/z.js"
import { deltaCircuitExample } from "./example.js"

const a = make<number, BaseA, number>(HM.fromIterable([
  [
    0,
    HM.fromIterable([[
      BaseA.make({
        a: 1,
        x: 2,
        id: 5
      }),
      1
    ], [
      BaseA.make({
        a: 3,
        x: 2,
        id: 4
      }),
      1
    ]])
  ]
]))
const b = make<number, BaseA, number>(HM.fromIterable([
  [
    0,
    HM.fromIterable([[
      BaseA.make({
        a: 4,
        x: 1,
        id: 6
      }),
      1
    ]])
  ]
]))

export const Sa = Stream.make(a, b)

const c = make<number, BaseB, number>(HM.fromIterable([
  [
    0,
    HM.fromIterable([[
      BaseB.make({
        s: 4,
        y: 2,
        id: 1
      }),
      1
    ], [
      BaseB.make({
        s: 6,
        y: 3,
        id: 4
      }),
      1
    ]])
  ]
]))

const d = make<number, BaseB, number>(HM.fromIterable([
  [
    0,
    HM.fromIterable([[
      BaseB.make({
        s: 8,
        y: 5,
        id: 6
      }),
      1
    ]])
  ]
]))

export const Sb = Stream.make(c, d)

Effect.runSync(
  deltaCircuitExample<number, BaseA, BaseB, number>(Z)(Sa, Sb).pipe(
    Logger.withMinimumLogLevel(LogLevel.All),
    Effect.provide(Logger.pretty)
  )
)
