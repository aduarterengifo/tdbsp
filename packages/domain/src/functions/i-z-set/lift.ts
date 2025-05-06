import { Stream } from "effect"

/**
 * 'lifts' a function f: A -> B to the stream operator ↑f: S_A -> S_B
 * by lifting it point-wise in time.
 */
export const unaryLift = <A, B>(f: (a: A) => B) => (stream: Stream.Stream<A>): Stream.Stream<B, never, never> =>
  Stream.map(stream, f)

/**
 * 'lifts' f: A x B -> C  to the stream operator  ↑f: S_A x S_B -> S_C
 * by lifting it point-wise in time.
 */
export const binaryLift =
  <A, B, C>(f: (a: A, b: B) => C) => (Sb: Stream.Stream<B>) => (Sa: Stream.Stream<A>): Stream.Stream<C, never, never> =>
    Stream.zipWith(Sa, Sb, f)
