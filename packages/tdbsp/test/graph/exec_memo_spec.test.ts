import { describe, expect, it } from "@effect/vitest"
import { Chunk, Data, Effect, HashMap as HM, Option, pipe, Queue, Stream } from "effect"
import { zipWithPrevious } from "effect/Stream"
import type { BaseJoined } from "../../src/data/c.js"
import { Sa, Sb } from "../../src/data/streams/input.js"
import { add as IZsetAdd } from "../../src/functions/i_z_set/binary/add.js"
import { make } from "../../src/functions/i_z_set/make.js"
import { equals } from "../../src/functions/streams/equals.js"
import { recursiveAddTree, recursiveAddTree2 } from "../../src/functions/streams/graph/examples/cycle_tree.js"
import { egStaticTree } from "../../src/functions/streams/graph/examples/static_tree.js"
import { execEffect, execMemo } from "../../src/functions/streams/graph/exec.js"
import { IZSetPretty } from "../../src/functions/streams/i_z_sets/utils.js"
import { add } from "../../src/functions/streams/lifted_add.js"
import { sub } from "../../src/functions/streams/lifted_sub.js"
import { Z } from "../../src/objs/z.js"

describe("stream delta example circuit", () => {
  it.effect("basic", () =>
    Effect.gen(function*() {
      // const resultOld = yield* deltaCircuitExample<number, BaseA, BaseB, number>(Z)(Sa, Sb)

      const result = pipe(
        egStaticTree(Sa, Sb),
        execMemo(Z)
      )

      const expected = Stream.make(
        make<number, BaseJoined, number>(HM.fromIterable([
          [
            4,
            HM.fromIterable([[
              Data.struct({
                x: 2,
                y: 3
              }),
              1
            ]])
          ]
        ])),
        make<number, BaseJoined, number>(HM.fromIterable([
          [
            6,
            HM.fromIterable([[
              Data.struct({
                x: 1,
                y: 5
              }),
              1
            ]])
          ]
        ]))
      )
      const Se = equals(Z)(expected)(result)

      const resArr = Chunk.toReadonlyArray(yield* Stream.runCollect(result))

      const expectedArr = Chunk.toReadonlyArray(yield* Stream.runCollect(expected))

      // expect(resChunk).toStrictEqual(expectedChunk)

      // Chunk.toReadonlyArray(yield* result.pipe(Stream.runCollect)).map((x) =>
      //   console.log(Array.from(x.index).map(([a, b]) => [a, Array.from(b)[0]]))
      // )

      const SeChunk = yield* Se.pipe(Stream.runCollect)
      const subChunk = Chunk.toReadonlyArray(yield* sub(Z)(expected)(result).pipe(Stream.runCollect))

      console.log("res 0", IZSetPretty(resArr[0]))
      console.log("exp 0", IZSetPretty(expectedArr[0]))
      console.log("res 1", IZSetPretty(resArr[1]))
      console.log("exp 1", IZSetPretty(expectedArr[1]))
      console.log("eq", SeChunk)
      console.log("sub", Array.from(subChunk[0].index).map((x) => Array.from(x[1]).map((x) => x[0])))
      const SeAll = yield* Se.pipe(Stream.runFold(
        true,
        (acc, a) => acc && a
      ))

      expect(SeAll).toBe(true)
    }))
  it.effect("cycle", () =>
    Effect.gen(function*() {
      const result = yield* pipe(
        recursiveAddTree2(Sa),
        execMemo(Z)
      )

      const expected = Stream.make(
        make<number, BaseJoined, number>(HM.fromIterable([
          [
            4,
            HM.fromIterable([[
              Data.struct({
                x: 2,
                y: 3
              }),
              1
            ]])
          ]
        ])),
        make<number, BaseJoined, number>(HM.fromIterable([
          [
            6,
            HM.fromIterable([[
              Data.struct({
                x: 1,
                y: 5
              }),
              1
            ]])
          ]
        ]))
      )
      const Se = equals(Z)(expected)(result)

      const resArr = Chunk.toReadonlyArray(yield* Stream.runCollect(result))

      const expectedArr = Chunk.toReadonlyArray(yield* Stream.runCollect(expected))

      expect(resArr).toStrictEqual(expectedArr)

      // Chunk.toReadonlyArray(yield* result.pipe(Stream.runCollect)).map((x) =>
      //   console.log(Array.from(x.index).map(([a, b]) => [a, Array.from(b)[0]]))
      // )

      const SeChunk = yield* Se.pipe(Stream.runCollect)
      const subChunk = Chunk.toReadonlyArray(yield* sub(Z)(expected)(result).pipe(Stream.runCollect))

      console.log("res 0", IZSetPretty(resArr[0]))
      console.log("exp 0", IZSetPretty(expectedArr[0]))
      console.log("res 1", IZSetPretty(resArr[1]))
      console.log("exp 1", IZSetPretty(expectedArr[1]))
      console.log("eq", SeChunk)
      console.log("sub", Array.from(subChunk[0].index).map((x) => Array.from(x[1]).map((x) => x[0])))
      const SeAll = yield* Se.pipe(Stream.runFold(
        true,
        (acc, a) => acc && a
      ))

      expect(SeAll).toBe(true)
    }))
  it.effect("simple", () =>
    Effect.gen(function*() {
      // how the fuck would you even express this outside of this
      // yield* Effect.log("hey")
      // const delayNumber = (stream: Stream.Stream<number>) =>
      //   Stream.zipWithPrevious(stream).pipe(
      //     Stream.map(([prev, _]) =>
      //       Option.match(prev, {
      //         onNone: () => 0,
      //         onSome: (prev) => prev
      //       })
      //     )
      //   )

      // const queue = yield* Queue.bounded<number>(2)
      // queue.offer(0)
      const scanWithPreviousOutput = <A, B>(
        initialValue: B, // The initial value for the "previous output" state
        binaryOp: (inputElement: A, previousOutput: B) => B // The binary operation
      ) =>
      (stream: Stream.Stream<A>): Stream.Stream<B> =>
        stream.pipe(
          // mapAccum takes an initial state and a function that produces [newState, outputElement]
          // In this case, the state is the "previous output", and the output element is the result of the binaryOp.
          Stream.mapAccum(initialValue, (previousOutput, currentInput) => {
            // Calculate the current output using the binary operation
            const currentOutput = binaryOp(currentInput, previousOutput)
            // The new state for the next iteration is the current output.
            // The output element for the current step is also the current output.
            return [currentOutput, currentOutput]
          })
        )

      const addWithPreviousOutput = scanWithPreviousOutput(0, (a: number, b: number) => a + b)

      const sA = Stream.fromIterable([1, 2, 3, 4])
      // const sC = delayNumber(Stream.fromQueue(queue))
      const steamAdd = (s1: Stream.Stream<number, never, never>, s2: Stream.Stream<number, never, never>) =>
        Stream.zipWith(s1, s2, (a, b) => a + b)

      const result = pipe(
        sA,
        zipWithPrevious,
        Stream.flatMap(([x, y]) =>
          steamAdd(Stream.fromIterable([Option.getOrElse(x, () => 0)]), Stream.fromIterable([y]))
        )
      )
      // Stream.map((x) => x + 0)(sA)

      // const r = Stream.zipWithPrevious(stream).pipe(
      //   Stream.map(([prev, curr]) =>
      //     Option.match(prev, {
      //       onNone: () => sA,
      //       onSome: (prev) => prev
      //     })
      //   )
      // )

      // //
      // const result = Stream.unfold(0, (n) => Option.some([n === 0 ? 0 : sA[0], n + 1]))
      // const alt = Stream.fromIterable([1, 2, 3])
      const result3 = addWithPreviousOutput(sA)

      const result2 = sA.pipe(
        // Stream.scan(initialState, (state, element) => newState)
        Stream.scan(0, (previousTotal, currentValue) => previousTotal + currentValue)
      )
      yield* Effect.log("hey")
      // yield* Stream.runForEach(result, (elem) => queue.offer(elem))

      const collect = yield* Stream.runCollect(result.pipe(Stream.take(5)))

      expect(collect).toStrictEqual(Chunk.fromIterable([1, 3, 6, 10]))
    }))
})
