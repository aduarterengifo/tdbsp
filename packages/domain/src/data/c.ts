import { Schema } from "effect"
import { PrettyNumber } from "./a.js"

export const BaseJoined = Schema.Struct({
  x: PrettyNumber,
  y: PrettyNumber
})

export type BaseJoined = typeof BaseJoined.Type
