import type { NonEmptyArray } from "effect/Array"

export const randomElem = <T>(list: Array<T>) => list[Math.floor(Math.random() * list.length)]
