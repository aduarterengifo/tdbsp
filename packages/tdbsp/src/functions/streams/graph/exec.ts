import { Effect, Fiber, Match, Queue, Stream } from "effect"
import type { IZSet, ZSet } from "../../../objs/i_z_set.js"
import type { Ring } from "../../../objs/ring.js"
import { iZSetDelayOp } from "../abelian-group/i_zset_stream/delay.js"
import { deltaDistinct } from "../i_z_sets/delta/distinct.js"
import { deltaJoin } from "../i_z_sets/delta/join.js"
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
  const memo = new WeakMap<Node<K, D, W>, Stream.Stream<IZSet<K, D, W>>>()

  // go is a closure
  // on children execution we check if the node we want to evaluate has already been evaluated.
  // if it has we return that.
  const go = (node: Node<K, D, W>): Stream.Stream<IZSet<K, D, W>> => {
    console.log("go on", node._tag)
    // console.log("memo", memo)
    if (memo.has(node)) {
      console.log("memo has node", node._tag)
      return memo.get(node)!
    }

    let placeholder: Stream.Stream<IZSet<K, D, W>> | undefined = undefined
    memo.set(node, Stream.suspend(() => placeholder!)) // safe lazy cycle

    const result = innerMemoExec<K, D, W>(ring, go)(node)

    placeholder = result
    return result
  }

  return go
}

const innerMemoExec =
  <K, D, W>(ring: Ring<W>, go: (node: Node<K, D, W>) => Stream.Stream<IZSet<K, D, W>>) =>
  (node: Node<K, D, W>): Stream.Stream<IZSet<K, D, W>> => {
    return Match.value(node).pipe(
      // binary
      Match.tag("AddNode", ({ children }) => {
        // get the stream of my two children
        const [a, b] = children.map(go)
        return add<K, D, W>(ring)(a)(b)
      }),
      Match.tag("SubNode", ({ children }) => {
        const [a, b] = children.map(go)
        return sub<K, D, W>(ring)(a)(b)
      }),
      Match.tag("MulNode", ({ children, fn }) => {
        const [a, b] = children.map(go)
        return mul<K, D, W>(ring)(fn)(b)(a)
      }),
      Match.tag("UnionNode", ({ children }) => {
        const [a, b] = children.map(go)
        return liftedUnion<K, D, W>(ring)(a)(b)
      }),
      Match.tag("JoinNode", ({ children, fn }) => {
        const [a, b] = children.map(go)
        // biome-ignore lint/suspicious/noExplicitAny: PROBLEMS
        return join<K, any, D, D, W>(ring)(fn)(b)(a)
      }),
      // unary
      Match.tag("FilterNode", ({ children, fn }) => {
        const [a] = children.map(go)
        return filter<K, D, W>(fn)(a)
      }),
      // // stream nodes just return themselves, an identity essentially.
      Match.tag("StreamNode", ({ stream }) => stream),
      // // basically identity.
      Match.tag("EndNode", ({ children }) => go(children[0])),
      Match.tag("DistinctNode", ({ children }) => {
        const [a] = children.map(go)
        return distinct<K, D, W>(ring)(a)
      }),
      Match.tag("DeIndexNode", ({ children }) => {
        const [a] = children.map(go)
        return deindex<K, D, W>()(a) as Stream.Stream<IZSet<K, D, W>> // for now
      }),
      Match.tag("IndexNode", ({ children, fn }) => {
        // CHEATING TODO: longterm probably move away from Zsets, I don't think they add much value.
        const [a] = children.map(go) as unknown as [Stream.Stream<ZSet<D, W>, never, never>]
        const t = index<K, D, W>(fn)(a)
        return t
      }),
      Match.tag("MapNode", ({ children, fn }) => {
        const [a] = children.map(go)
        // biome-ignore lint/suspicious/noExplicitAny: PROBLEMS
        return map<K, any, D, W>(fn)(a)
      }),
      // deltas
      Match.tag("DeltaDistinctNode", ({ children }) => {
        const [a] = children.map(go)
        // biome-ignore lint/suspicious/noExplicitAny: PROBLEMS
        return deltaDistinct<K, D, W>(ring)(a)
      }),
      Match.tag("DeltaJoinNode", ({ children, fn }) => {
        const [a, b] = children.map(go)
        // biome-ignore lint/suspicious/noExplicitAny: PROBLEMS
        return Effect.runSync(deltaJoin<K, any, D, D, W>(ring)(fn)(b)(a)) // someday we'll have to address this
      }),
      Match.tag("DelayNode", ({ children }) => {
        const [a] = children.map(go)
        return iZSetDelayOp<K, D, W>(ring)(a)
      }),
      Match.tag("FixPointNode", ({ fn }) => {
        // const placeholder = Stream.fromIterable<IZSet<K, D, W>>([])

        // I have a 2 element queue.
        const queue = Queue.bounded<IZSet<K, D, W>>(2)

        const logic = queue.pipe(
          Effect.flatMap((feedbackQueue) =>
            Effect.gen(function*() {
              // create a stream from the queue
              Queue.offer(ring.zero)
              const feedbackInputHandle = Stream.fromQueue(feedbackQueue)
              yield* Effect.log("hey")
              // delay said stream
              const delayedInput = iZSetDelayOp<K, D, W>(ring)(feedbackInputHandle)
              // get the subgraph.
              const rootOfRecursiveSubgraph = fn(delayedInput)
              console.log("root", rootOfRecursiveSubgraph)
              // evaluate the subgraph.
              const outputStreamOfSubgraph = go(rootOfRecursiveSubgraph)
              console.log("output", outputStreamOfSubgraph)
              // create effect for dumping elements of the stream to the queue.
              const connectLoopEffect = Stream.runForEach(
                outputStreamOfSubgraph,
                (element) => {
                  console.log("element", element)
                  return Queue.offer(feedbackQueue, element)
                }
              )

              yield* connectLoopEffect

              return outputStreamOfSubgraph

              // return yield* Effect.forkDaemon(connectLoopEffect).pipe(
              //   Effect.map((fiber) => {
              //     // Return the output stream of the subgraph as the result of this Effect.
              //     // We can add interruption logic to the stream based on the fiber or queue.
              //     return outputStreamOfSubgraph.pipe(
              //       Stream.interruptWhen(Fiber.await(fiber)), // Interrupt stream if the background fiber finishes
              //       Stream.interruptWhen(Queue.isShutdown(feedbackQueue)) // Interrupt stream if the queue is shut down
              //     ) as Stream.Stream<IZSet<K, D, W>> // Cast might still be needed depending on type flow
              //   })
              // )
            })
          )
        )

        return logic
      }),
      Match.exhaustive
    )
  }
