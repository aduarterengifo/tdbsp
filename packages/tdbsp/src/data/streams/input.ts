import { Data, HashMap as HM, Stream } from "effect"
import { make } from "../../functions/i_z_set/make.js"
import type { BaseA } from "../a.js"
import type { BaseB } from "../b.js"

export const Sa1 = make<number, BaseA, number>(HM.fromIterable([
  [
    0,
    HM.fromIterable([[
      Data.struct({
        a: 1,
        x: 2,
        id: 5
      }),
      1
    ], [
      Data.struct({
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
      Data.struct({
        a: 4,
        x: 1,
        id: 6
      }),
      1
    ]])
  ]
]))

export const Sa = Stream.make(Sa1, b)

export const SaSimpl = Stream.make(
  make<number, number, number>(HM.fromIterable([[0, HM.fromIterable([[1, 1]])]])),
  make<number, number, number>(HM.fromIterable([[0, HM.fromIterable([[2, 1]])]])),
  make<number, number, number>(HM.fromIterable([[0, HM.fromIterable([[3, 1]])]]))
)

export const Sb1 = make<number, BaseB, number>(HM.fromIterable([
  [
    0,
    HM.fromIterable([[
      Data.struct({
        s: 4,
        y: 2,
        id: 1
      }),
      1
    ], [
      Data.struct({
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
      Data.struct({
        s: 8,
        y: 5,
        id: 6
      }),
      1
    ]])
  ]
]))

export const Sb = Stream.make(Sb1, d)
