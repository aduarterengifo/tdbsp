/**
 * multiplicative identity (1)
 * additive identity       (0)
 * addition                (+)
 * additive inverse        (-)
 * multiplication          (*)
 */
export type Ring<T> = {
  add: (x: T, y: T) => T
  sub: (x: T, y: T) => T
  leq: (x: T, y: T) => boolean
  mul: (x: T, y: T) => T
  one: T
  zero: T
}
