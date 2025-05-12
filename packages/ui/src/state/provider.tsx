import { Chunk, Effect, Option, pipe, Stream } from "effect";
import { useMemo, useState, type PropsWithChildren } from "react";
import type { IZSet } from "@a33/tdbsp/src/objs/i_z_set"
import type {BaseA} from "@a33/tdbsp/src/data/a"
import type {BaseB} from "@a33/tdbsp/src/data/b"
import type { BaseJoined } from "@a33/tdbsp/src/data/c"
import  { Sa, Sb } from "@a33/tdbsp/src/data/streams/input"
import {egStaticTree} from "@a33/tdbsp/src/functions/streams/graph/examples/static_tree"
import {exec} from "@a33/tdbsp/src/functions/streams/graph/exec"
import {Z} from "@a33/tdbsp/src/objs/z"

import { Ctx } from "./ctx";

export function CtxProvider({ children }: PropsWithChildren) {
	const [time, setTime] = useState(0);

	// these will always begin with something FOR SIMPLICITY!!! 
	const [streamA, setStreamA] = useState<Stream.Stream<IZSet<number,BaseA,number>>>(Sa);
	const [streamB, setStreamB] = useState<Stream.Stream<IZSet<number,BaseB, number>>>(Sb);
	const [streamAChanges, setStreamAChanges] = useState<Stream.Stream<IZSet<number,BaseA,number>>>(Sa);
	const [streamBChanges, setStreamBChanges] = useState<Stream.Stream<IZSet<number,BaseB, number>>>(Sb);
	const [streamIncremental, setStreamIncremental] = useState<Stream.Stream<IZSet<number, BaseJoined, number>>>(pipe(
        egStaticTree(Sa, Sb),
        exec(Z)
      ));
	const [streamStatic, setStreamStatic] = useState<Stream.Stream<IZSet<number,BaseJoined, number>>>(pipe(
        egStaticTree(Sa, Sb),
        exec(Z)
      ));

	// TODO RESULT CALCULATIONS


	// const [historyA, setHistoryA] = useState([inputAZset]);
	// const staticResult = useMemo(() => {

	// }, [historyA, historyB])

	const forward = () => {
		console.log('running forward')
		// if this index doesn't already exist in the input streams. 
		// generate random z-set update on A and B 
		// calculate downstream incremental and static results.

		// 1. Figure out the index.
		const collectedStreamA = Stream.runCollect(streamA)

		const chunkStreamA = Effect.runSync(collectedStreamA)

		const chuckStreamALength = Chunk.size(chunkStreamA)

		const collectedStreamB = Stream.runCollect(streamB)

		const chunkStreamB = Effect.runSync(collectedStreamB)


		if (time + 1 >= chuckStreamALength) {

			// A CHANGES

			// biome-ignore lint/style/noNonNullAssertion: FOR SIMPLICITY
			const lastZSet = Option.getOrNull(Chunk.last(chunkStreamA))!

			const { newZSet, changeInstance } = getTheNext(lastZSet)
			// const changeInstance = make<BaseA>(
			// 	HashMap.fromIterable([[Data.struct({ x: 6, id: 11, a: 10 }), 1]]),
			// )
			// const newZSet = Stream.make(
			// 	lastZSet,
			// 	changeInstance,
			// )
			// append newZset to stream 

			const newStreamA = Stream.fromChunk(Chunk.append(Effect.runSync(Stream.runCollect(streamA)), newZSet))

			// append change Instance to change stream.
			const newStreamAChanges = Stream.fromChunk(Chunk.append(Effect.runSync(Stream.runCollect(streamAChanges)), changeInstance))


			// B CHANGES

			// biome-ignore lint/style/noNonNullAssertion: FOR SIMPLICITY
			const lastZSetB = Option.getOrNull(Chunk.last(chunkStreamB))!


			const B = getTheNext(lastZSetB)

			// append newZset to stream 
			const newStreamB = Stream.fromChunk(Chunk.append(Effect.runSync(Stream.runCollect(streamB)), B.newZSet))


			const newStreamBChanges = Stream.fromChunk(Chunk.append(Effect.runSync(Stream.runCollect(streamBChanges)), B.changeInstance))
			// append change Instance to change stream.

			// STATIC RESULT CHANGES 

			const newStreamStatic = exampleCircuitOneLiftedOptimized(newStreamA, newStreamB)


			const newStreamIncremental = exampleCircuitOneIncrementalOptimizedTwo(newStreamAChanges, newStreamBChanges)
			console.log('newStreamIncremental', Chunk.toReadonlyArray(
				Effect.runSync(Stream.runCollect(newStreamIncremental)),
			).map(x => Array.from(x.data)))
			setStreamA(newStreamA)
			setStreamAChanges(newStreamAChanges)
			setStreamB(newStreamB)
			setStreamBChanges(newStreamBChanges)
			setStreamStatic(newStreamStatic)
			setStreamIncremental(newStreamIncremental)

		}


		setTime((time) => {
			return time + 1
		})
	}

	const backward = () => {

	}

	const historyA = useMemo(() => {
		return Chunk.toReadonlyArray(Effect.runSync(Stream.runCollect(streamA)))
	}, [streamA])

	const historyB = useMemo(() => {
		return Chunk.toReadonlyArray(Effect.runSync(Stream.runCollect(streamB)))
	}, [streamB])

	const changesA = useMemo(() => {
		return Chunk.toReadonlyArray(Effect.runSync(Stream.runCollect(streamAChanges)))
	}, [streamAChanges])

	const changesB = useMemo(() => {
		return Chunk.toReadonlyArray(Effect.runSync(Stream.runCollect(streamBChanges)))
	}, [streamBChanges])

	const staticResult = useMemo(() => {
		return Chunk.toReadonlyArray(Effect.runSync(Stream.runCollect(streamStatic)))
	}, [streamStatic])

	const incrementalResult = useMemo(() => {
		return Chunk.toReadonlyArray(Effect.runSync(Stream.runCollect(streamIncremental)))
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
