import type { NonEmptyArray } from "effect/Array"

export const randomElem = <T>(list: NonEmptyArray<T>) => list[Math.floor(Math.random() * list.length)]
