import type { NonEmptyArray } from "effect/Array"

export const pickRandom = <T>(list: NonEmptyArray<T>) => list[Math.floor(Math.random() * list.length)]
