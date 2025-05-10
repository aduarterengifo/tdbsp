import { Option } from "effect"
import type { Ring } from "../ring.js"

export const zeroToNone = <W>(ring: Ring<W>) => (value: W): Option.Option<W> => {
  return value !== ring.zero ? Option.some(value) : Option.none()
}
