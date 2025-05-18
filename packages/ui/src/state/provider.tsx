import { Chunk, Effect, Option, pipe, Stream } from "effect";
import { useMemo, useState, type PropsWithChildren } from "react";
import type { IZSet } from "@a33/tdbsp/src/objs/i_z_set"
import type {BaseA} from "@a33/tdbsp/src/data/a"
import type {BaseB} from "@a33/tdbsp/src/data/b"
import { BaseJoined } from "@a33/tdbsp/src/data/c"
import  { Sa1, Sb1 } from "@a33/tdbsp/src/data/streams/input"
import  { SaFull, SbFull } from "@a33/tdbsp/src/data/streams/app_inputs"
import {egStaticTree} from "@a33/tdbsp/src/functions/streams/graph/examples/static_tree"
import {egIncrementalTree} from "@a33/tdbsp/src/functions/streams/graph/examples/incremetal_tree"
import {exec} from "@a33/tdbsp/src/functions/streams/graph/exec"

import {randomGen} from "@a33/tdbsp/src/functions/i_z_set/random_gen"

import {Z} from "@a33/tdbsp/src/objs/z"

import { Ctx } from "./ctx";
import { iZSetIntOp } from "@a33/tdbsp/src/functions/streams/abelian-group/i_zset_stream/int";
import {make} from "@a33/tdbsp/src/functions/i_z_set/make"


export function CtxProvider({ children }: PropsWithChildren) {
	const [time, setTime] = useState(1);

	// these will always begin with something FOR SIMPLICITY!!! 
	const [streamA, setStreamA] = useState<Stream.Stream<IZSet<number,BaseA,number>>>(SaFull);
	const [streamB, setStreamB] = useState<Stream.Stream<IZSet<number,BaseB, number>>>(SbFull);
	const [streamAChanges, setStreamAChanges] = useState<Stream.Stream<IZSet<number,BaseA,number>>>(SaFull);
	const [streamBChanges, setStreamBChanges] = useState<Stream.Stream<IZSet<number,BaseB, number>>>(SbFull);
	const [streamIncremental, setStreamIncremental] = useState<Stream.Stream<IZSet<number, BaseJoined, number>>>(pipe(
		egIncrementalTree(Z)(SaFull,SbFull),
        exec(Z)
      ));
	const [streamStatic, setStreamStatic] = useState<Stream.Stream<IZSet<number,BaseJoined, number>>>(pipe(
        egStaticTree(SaFull, SbFull),
        exec(Z)
      ));

	// TODO RESULT CALCULATIONS


	// const [historyA, setHistoryA] = useState([inputAZset]);
	// const staticResult = useMemo(() => {

	// }, [historyA, historyB])

    const forwardEffect = Effect.gen(function*() {
        const sA = yield* Stream.runCollect(streamA)
        const sB = yield* Stream.runCollect(streamB)

        const sASize = Chunk.size(sA)
        
        if (time + 1 >= sASize) {
            console.log('inside condition')
            const lastA = Option.getOrNull(Chunk.last(sA))!

            const A = randomGen<number,BaseA,number>(Z)(Sa1)(lastA)

            console.log('random gen',Array.from(A.newZSet.index),Array.from(A.changeInstance.index))

            const newStreamA = Stream.concatAll(Chunk.make(streamA,Stream.make(A.newZSet)))

			console.log('newStreamA', newStreamA)

			const newStreamAChanges = Stream.concatAll(Chunk.make(streamAChanges,Stream.make(A.changeInstance))) 

            console.log('newStreamAChanges', newStreamAChanges)
            const lastB = Option.getOrNull(Chunk.last(sB))!

            const B = randomGen<number,BaseB,number>(Z)(Sb1)(lastB)

            const newStreamB = Stream.concatAll(Chunk.make(streamB,Stream.make(B.newZSet)))

			const newStreamBChanges = Stream.concatAll(Chunk.make(streamBChanges,Stream.make(B.changeInstance))) 

            const newStreamStatic = pipe(
                egStaticTree(newStreamA, newStreamB),
                exec(Z)
            )


            const newStreamIncremental = pipe(
                egIncrementalTree(Z)(newStreamAChanges, newStreamBChanges),
                exec(Z)
            )

            setStreamA(newStreamA)
			setStreamAChanges(newStreamAChanges)
			setStreamB(newStreamB)
			setStreamBChanges(newStreamBChanges)
			setStreamStatic(newStreamStatic)
			setStreamIncremental(newStreamIncremental)
        }
    })

	const forward = () => {
        console.log('forward one')
        Effect.runSync(forwardEffect)
		setTime((time) => {
			return time + 1
		})
	}

	const backward = () => {

	}

	const historyA = useMemo(() => 
		pipe(
			streamA,
			Stream.runCollect,
			Effect.runSync,
			Chunk.toReadonlyArray
		)
	, [streamA])

	const historyB = useMemo(() => 
		pipe(
			streamB,
			Stream.runCollect,
			Effect.runSync,
			Chunk.toReadonlyArray
		)
	, [streamB])

	const changesA = useMemo(() => 
		pipe(
			streamAChanges,
			Stream.runCollect,
			Effect.runSync,
			Chunk.toReadonlyArray
		)
	, [streamAChanges])

	const changesB = useMemo(() => 
		pipe(
			streamBChanges,
			Stream.runCollect,
			Effect.runSync,
			Chunk.toReadonlyArray
		)
	, [streamBChanges])

	const staticResult = useMemo(() => 
		pipe(
			streamStatic,
			Stream.runCollect,
			Effect.runSync,
			Chunk.toReadonlyArray
		)
	, [streamStatic])

	const incrementalResult = useMemo(() => 
		pipe(
			streamIncremental,
			Stream.runCollect,
			Effect.runSync,
			Chunk.toReadonlyArray,
			t => {
				console.log('incr', t)
				return t
			}
		)
	, [streamIncremental])

	const staticView = useMemo(() => {
		// console.log(t)
		return staticResult[staticResult.length - 1]
	}, [staticResult])

	const incrementalView = useMemo(() => {
		const t = pipe(
			Stream.runLast(iZSetIntOp<number, BaseJoined, number>(Z)(streamIncremental)),
			Effect.runSync,
			Option.getOrUndefined,
		)
		return t ?? make<number,BaseJoined,number>()
	}, [streamIncremental])




	return <Ctx.Provider value={{
		time,
		streamA,
		streamB,
		streamAChanges,
		streamBChanges,
		streamIncremental,
		streamStatic,
		historyA,
		historyB,
		changesA,
		changesB,
		staticResult,
		incrementalResult,
		staticView,
		incrementalView,
		setTime,
		setStreamA,
		setStreamB,
		setStreamAChanges,
		setStreamBChanges,
		setStreamIncremental,
		setStreamStatic,
		forward,
		backward
	}}> {children}</Ctx.Provider >;
}
