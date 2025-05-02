/**
 * additive identity       (0)
 * add                     (+)
 * substract               (-)
 * associativity
 * commutativity
 */
export type AbelianGroup<T> = {
  add: (x: T, y: T) => T
  sub: (x: T, y: T) => T
  zero: T
}
