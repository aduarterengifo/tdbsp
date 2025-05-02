import type { Ring } from "./ring.js"

export const Z: Ring<number> = {
  add: (x, y) => x + y,
  sub: (x, y) => x - y,
  leq: (x, y) => x <= y,
  mul: (x, y) => x * y,
  one: 1,
  zero: 0
}
