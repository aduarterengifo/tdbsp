import { Chunk, Console, Effect, Match, Option, pipe, Queue, Stream } from "effect"
import type { NoSuchElementException } from "effect/Cause"
import type { IZSet, ZSet } from "../../../objs/i_z_set.js"
import type { Ring } from "../../../objs/ring.js"
import { make } from "../../i_z_set/make.js"
import { iZSetDelayOp } from "../abelian-group/i_zset_stream/delay.js"
import { iZSetDiffOp } from "../abelian-group/i_zset_stream/diff.js"
import { iZSetIntOp } from "../abelian-group/i_zset_stream/int.js"
import { deltaDistinct } from "../i_z_sets/delta/distinct.js"
import { deltaJoin } from "../i_z_sets/delta/join.js"
import { logStream } from "../i_z_sets/utils.js"
import { add } from "../lifted_add.js"
import { deindex } from "../lifted_de_index.js"
import { distinct } from "../lifted_distinct.js"
import { filter } from "../lifted_filter.js"
import { index } from "../lifted_index.js"
import { join } from "../lifted_join.js"
import { map } from "../lifted_map.js"
import { mul } from "../lifted_multiply.js"
import { sub } from "../lifted_sub.js"
import { liftedUnion } from "../union.js"
import type { Node } from "./nodes/unions/node.js"

// TODO: in addition to execution we need optimization AND incrementallization.
// note there is really no way to compute over z-sets, the paper describes computation over z-sets and the lifts it to streams as part of the algorithm.
/**
 * executes the computation graph.
 */
export const exec = <K, D, W>(ring: Ring<W>) => (node: Node<K, D, W>): Stream.Stream<IZSet<K, D, W>> => {
  // console.log("node", node._tag)
  return Match.value(node).pipe(
    // binary
    Match.tag("AddNode", ({ children }) => {
      // get the stream of my two children
      const [a, b] = children.map(exec<K, D, W>(ring))
      return add<K, D, W>(ring)(a)(b)
    }),
    Match.tag("SubNode", ({ children }) => {
      const [a, b] = children.map(exec<K, D, W>(ring))
      return sub<K, D, W>(ring)(a)(b)
    }),
    Match.tag("MulNode", ({ children, fn }) => {
      const [a, b] = children.map(exec<K, D, W>(ring))
      return mul<K, D, W>(ring)(fn)(b)(a)
    }),
    Match.tag("UnionNode", ({ children }) => {
      const [a, b] = children.map(exec<K, D, W>(ring))
      return liftedUnion<K, D, W>(ring)(a)(b)
    }),
    Match.tag("JoinNode", ({ children, fn }) => {
      const [a, b] = children.map(exec<K, D, W>(ring))
      // biome-ignore lint/suspicious/noExplicitAny: PROBLEMS
      return join<K, any, D, D, W>(ring)(fn)(b)(a)
    }),
    // unary
    Match.tag("FilterNode", ({ children, fn }) => {
      const [a] = children.map(exec<K, D, W>(ring))
      return filter<K, D, W>(fn)(a)
    }),
    // // stream nodes just return themselves, an identity essentially.
    Match.tag("StreamNode", ({ stream }) => stream),
    // // basically identity.
    Match.tag("EndNode", ({ children }) => exec<K, D, W>(ring)(children[0])),
    Match.tag("DistinctNode", ({ children }) => {
      const [a] = children.map(exec<K, D, W>(ring))
      return distinct<K, D, W>(ring)(a)
    }),
    Match.tag("DeIndexNode", ({ children }) => {
      const [a] = children.map(exec<K, D, W>(ring))
      return deindex<K, D, W>()(a) as Stream.Stream<IZSet<K, D, W>> // for now
    }),
    Match.tag("IndexNode", ({ children, fn }) => {
      // CHEATING TODO: longterm probably move away from Zsets, I don't think they add much value.
      const [a] = children.map(exec<K, D, W>(ring)) as unknown as [Stream.Stream<ZSet<D, W>, never, never>]
      const t = index<K, D, W>(fn)(a)
      return t
    }),
    Match.tag("MapNode", ({ children, fn }) => {
      const [a] = children.map(exec<K, D, W>(ring))
      // biome-ignore lint/suspicious/noExplicitAny: PROBLEMS
      return map<K, any, D, W>(fn)(a)
    }),
    // deltas
    Match.tag("DeltaDistinctNode", ({ children }) => {
      const [a] = children.map(exec<K, D, W>(ring))
      // biome-ignore lint/suspicious/noExplicitAny: PROBLEMS
      return deltaDistinct<K, D, W>(ring)(a)
    }),
    Match.tag("DeltaJoinNode", ({ children, fn }) => {
      const [a, b] = children.map(exec<K, D, W>(ring))
      // biome-ignore lint/suspicious/noExplicitAny: PROBLEMS
      return Effect.runSync(deltaJoin<K, any, D, D, W>(ring)(fn)(b)(a)) // someday we'll have to address this
    }),
    Match.tag("DelayNode", ({ children }) => {
      const [a] = children.map(exec<K, D, W>(ring))
      return iZSetDelayOp<K, D, W>(ring)(a)
    }),
    Match.exhaustive
  )
}

export const execMemo = <K, D, W>(ring: Ring<W>) => {
  const memo = new WeakMap<Node<K, D, W>, Stream.Stream<IZSet<K, D, W>, NoSuchElementException | never, never>>()

  // go is a closure
  // on children execution we check if the node we want to evaluate has already been evaluated.
  // if it has we return that.
  const go = (
    node: Node<K, D, W>
  ): Effect.Effect<Stream.Stream<IZSet<K, D, W>, NoSuchElementException | never, never>> =>
    Effect.gen(function*() {
      const memoNode = memo.get(node)

      if (memoNode !== undefined) {
        return memoNode
      }

      let placeholder: Stream.Stream<IZSet<K, D, W>, NoSuchElementException | never, never> = Stream.empty
      memo.set(node, placeholder) // safe lazy cycle
      yield* Effect.log("exec", node._tag)
      const result = yield* execEffect<K, D, W>(ring, go)(node)

      placeholder = result
      return result
    })

  return go
}

export const execEffect =
  <K, D, W>(ring: Ring<W>, go: (node: Node<K, D, W>) => Effect.Effect<Stream.Stream<IZSet<K, D, W>>>) =>
  (node: Node<K, D, W>): Effect.Effect<Stream.Stream<IZSet<K, D, W>, NoSuchElementException | never, never>> => {
    return Match.value(node).pipe(
      // binary
      Match.tag(
        "AddNode",
        ({ children }) =>
          pipe(
            Effect.all(children.map(go)),
            Effect.flatMap(([a, b]) => Effect.succeed(add<K, D, W>(ring)(a)(b)))
          )
      ),
      Match.tag(
        "SubNode",
        ({ children }) =>
          pipe(
            Effect.all(children.map(go)),
            Effect.flatMap(([a, b]) => Effect.succeed(sub<K, D, W>(ring)(a)(b)))
          )
      ),
      Match.tag(
        "MulNode",
        ({ children, fn }) =>
          pipe(
            Effect.all(children.map(go)),
            Effect.flatMap(([a, b]) => Effect.succeed(mul<K, D, W>(ring)(fn)(b)(a)))
          )
      ),
      Match.tag(
        "UnionNode",
        ({ children }) =>
          pipe(
            Effect.all(children.map(go)),
            Effect.flatMap(([a, b]) => Effect.succeed(liftedUnion<K, D, W>(ring)(a)(b)))
          )
      ),
      Match.tag(
        "JoinNode",
        ({ children, fn }) =>
          pipe(
            Effect.all(children.map(go)),
            Effect.flatMap(([a, b]) =>
              // biome-ignore lint/suspicious/noExplicitAny: PROBLEMS
              Effect.succeed(join<K, any, D, D, W>(ring)(fn)(b)(a))
            )
          )
      ),
      // unary
      Match.tag("FilterNode", ({ children, fn }) =>
        pipe(
          Effect.all(children.map(go)),
          Effect.flatMap(([a]) => Effect.succeed(filter<K, D, W>(fn)(a)))
        )),
      // // stream nodes just return themselves, an identity essentially.
      Match.tag("StreamNode", ({ stream }) => Effect.succeed(stream)),
      // // basically identity.
      Match.tag("EndNode", ({ children }) =>
        pipe(
          Effect.all(children.map(go)),
          Effect.flatMap(([a]) => Effect.succeed(a))
        )),
      Match.tag("DistinctNode", ({ children }) =>
        pipe(
          Effect.all(children.map(go)),
          Effect.flatMap(([a]) => Effect.succeed(distinct<K, D, W>(ring)(a)))
        )),
      Match.tag("DeIndexNode", ({ children }) =>
        pipe(
          Effect.all(children.map(go)),
          Effect.flatMap(([a]) => Effect.succeed(deindex<K, D, W>()(a) as Stream.Stream<IZSet<K, D, W>>))
        )),
      Match.tag("IndexNode", ({ children, fn }) =>
        pipe(
          Effect.all(children.map(go)),
          Effect.flatMap(([a]) => {
            // CHEATING TODO: longterm probably move away from Zsets, I don't think they add much value.
            const t = index<K, D, W>(fn)(a as unknown as Stream.Stream<ZSet<D, W>, never, never>)
            return Effect.succeed(t)
          })
        )),
      Match.tag("MapNode", ({ children, fn }) =>
        pipe(
          Effect.all(children.map(go)),
          Effect.flatMap(([a]) =>
            // biome-ignore lint/suspicious/noExplicitAny: PROBLEMS
            Effect.succeed(map<K, any, D, W>(fn)(a))
          )
        )),
      // deltas
      Match.tag("DeltaDistinctNode", ({ children }) =>
        pipe(
          Effect.all(children.map(go)),
          Effect.flatMap(([a]) => Effect.succeed(deltaDistinct<K, D, W>(ring)(a)))
        )),
      Match.tag("DeltaJoinNode", ({ children, fn }) =>
        pipe(
          Effect.all(children.map(go)),
          Effect.flatMap(([a, b]) =>
            // biome-ignore lint/suspicious/noExplicitAny: PROBLEMS
            deltaJoin<K, any, D, D, W>(ring)(fn)(b)(a) // someday we'll have to address this
          )
        )),
      Match.tag("DelayNode", ({ children }) =>
        pipe(
          Effect.all(children.map(go)),
          Effect.flatMap(([a]) => Effect.succeed(iZSetDelayOp<K, D, W>(ring)(a)))
        )),
      Match.tag("FixPointNode", ({ fn, streams }) =>
        Effect.gen(function*() {
          const fixpoint = (
            input: Stream.Stream<IZSet<K, D, W>, NoSuchElementException, never>,
            prevLength: number = -1
          ): Effect.Effect<Stream.Stream<IZSet<K, D, W>, NoSuchElementException, never>> =>
            Effect.gen(function*() {
              const res = yield* pipe(
                input,
                fn,
                go,
                Effect.flatMap(
                  Stream.runCollect
                )
              )

              if (res.length > prevLength) {
                return yield* fixpoint(Stream.concat(input, Chunk.last(res)), res.length)
              } else {
                return input
              }
            })

          const resultStream = yield* fixpoint(Stream.fromIterable([make<K, D, W>()]))
          return resultStream.pipe(Stream.drop(1))
        })),
      Match.tag("DiffNode", ({ children }) =>
        pipe(
          Effect.all(children.map(go)),
          Effect.flatMap(([a]) => Effect.succeed(iZSetDiffOp<K, D, W>(ring)(a)))
        )),
      Match.tag("IntegralNode", ({ children }) =>
        pipe(
          Effect.all(children.map(go)),
          Effect.flatMap(([a]) => Effect.succeed(iZSetIntOp<K, D, W>(ring)(a)))
        )),
      Match.exhaustive
    )
  }
