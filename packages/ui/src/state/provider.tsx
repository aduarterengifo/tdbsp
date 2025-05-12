import { Chunk, Effect, Option, pipe, Stream } from "effect";
import { useMemo, useState, type PropsWithChildren } from "react";
import type { IZSet } from "@a33/tdbsp/src/objs/i_z_set"
import type {BaseA} from "@a33/tdbsp/src/data/a"
import type {BaseB} from "@a33/tdbsp/src/data/b"
import type { BaseJoined } from "@a33/tdbsp/src/data/c"
import  { Sa, Sa1, Sb, Sb1 } from "@a33/tdbsp/src/data/streams/input"
import {egStaticTree} from "@a33/tdbsp/src/functions/streams/graph/examples/static_tree"
import {exec} from "@a33/tdbsp/src/functions/streams/graph/exec"

import {randomGen} from "@a33/tdbsp/src/functions/i_z_set/random_gen"

import {Z} from "@a33/tdbsp/src/objs/z"

import { Ctx } from "./ctx";

export function CtxProvider({ children }: PropsWithChildren) {
	const [time, setTime] = useState(1);

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

    const forwardEffect = Effect.gen(function*() {
        const sA = yield* Stream.runCollect(streamA)
        const sB = yield* Stream.runCollect(streamB)

        const sASize = Chunk.size(sA)
        
        if (time + 1 >= sASize) {
            console.log('inside condition')
            const lastA = Option.getOrNull(Chunk.last(sA))!

            const A = randomGen(Sa1)(lastA)

            console.log('random gen',Array.from(A.newZSet.index),Array.from(A.changeInstance.index))

            const newStreamA = Stream.concatAll(Chunk.make(streamA,Stream.make(A.newZSet)))

			const newStreamAChanges = Stream.concatAll(Chunk.make(streamAChanges,Stream.make(A.changeInstance))) 

            console.log('newStreamAChanges', newStreamAChanges)
            const lastB = Option.getOrNull(Chunk.last(sB))!

            const B = randomGen(Sb1)(lastB)

            const newStreamB = Stream.concatAll(Chunk.make(streamB,Stream.make(B.newZSet)))

			const newStreamBChanges = Stream.concatAll(Chunk.make(streamBChanges,Stream.make(B.changeInstance))) 

            const newStreamStatic = pipe(
                egStaticTree(newStreamA, newStreamB),
                exec(Z)
            )

            setStreamA(newStreamA)
			setStreamAChanges(newStreamAChanges)
			setStreamB(newStreamB)
			setStreamBChanges(newStreamBChanges)
			setStreamStatic(newStreamStatic)
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
