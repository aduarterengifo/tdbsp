import { createContext } from 'react';
import type { IZSet } from "@a33/tdbsp/src/objs/i_z_set"
import type {BaseA} from "@a33/tdbsp/src/data/a"
import type {BaseB} from "@a33/tdbsp/src/data/b"
import type { BaseJoined } from "@a33/tdbsp/src/data/c"


import { Stream } from 'effect';

export type CTX<K,W> = {
	time: number;
	streamA: Stream.Stream<IZSet<K,BaseA,W>>;
	streamB: Stream.Stream<IZSet<K,BaseB,W>>;
	streamAChanges: Stream.Stream<IZSet<K,BaseA,W>>;
	streamBChanges: Stream.Stream<IZSet<K,BaseB,W>>;
	streamIncremental: Stream.Stream<IZSet<K,BaseJoined, W>>;
	streamStatic: Stream.Stream<IZSet<K,BaseJoined, W>>;
	historyA: readonly IZSet<K,BaseA,W>[];
	historyB: readonly IZSet<K,BaseB,W>[];
	changesA: readonly IZSet<K,BaseA,W>[];
	changesB: readonly IZSet<K,BaseB,W>[];
	staticResult: readonly IZSet<K,BaseJoined,W>[];
	incrementalResult: readonly IZSet<K,BaseJoined,W>[];
	setTime: (f: (x: number) => number) => void;
	setStreamA: (
		f: (x: Stream.Stream<IZSet<K,BaseA,W>>) => Stream.Stream<IZSet<K,BaseA,W>>,
	) => void;
	setStreamB: (
		f: (x: Stream.Stream<IZSet<K,BaseB,W>>) => Stream.Stream<IZSet<K,BaseB,W>>,
	) => void;
	setStreamAChanges: (
		f: (x: Stream.Stream<IZSet<K,BaseA,W>>) => Stream.Stream<IZSet<K,BaseA,W>>,
	) => void;
	setStreamBChanges: (
		f: (x: Stream.Stream<IZSet<K,BaseB,W>>) => Stream.Stream<IZSet<K,BaseB,W>>,
	) => void;
	setStreamIncremental: (
		f: (
			x: Stream.Stream<IZSet<K,BaseJoined,W>>,
		) => Stream.Stream<IZSet<K,BaseJoined,W>>,
	) => void;
	setStreamStatic: (
		f: (
			x: Stream.Stream<IZSet<K,BaseJoined,W>>,
		) => Stream.Stream<IZSet<K,BaseJoined,W>>,
	) => void;
	forward: () => void;
	backward: () => void;
	// setHistoryA: (f: (x: ZSetObj<BaseA>) => ZSetObj<BaseA>) => void;
	// setHistoryB: (f: (x: ZSetObj<BaseB>) => ZSetObj<BaseB>) => void;
	// setChangesA: (f: (x: ZSetObj<BaseA>) => ZSetObj<BaseA>) => void;
	// setChangesB: (f: (x: ZSetObj<BaseB>) => ZSetObj<BaseB>) => void;
};

export const Ctx = createContext<CTX<number,number>>({
	time: 0,
	streamA: Stream.empty,
	streamB: Stream.empty,
	streamAChanges: Stream.empty,
	streamBChanges: Stream.empty,
	streamIncremental: Stream.empty,
	streamStatic: Stream.empty,
	historyA: [],
	historyB: [],
	changesA: [],
	changesB: [],
	staticResult: [],
	incrementalResult: [],
	setTime: () => {},
	setStreamA: () => {},
	setStreamB: () => {},
	setStreamAChanges: () => {},
	setStreamBChanges: () => {},
	setStreamIncremental: () => {},
	setStreamStatic: () => {},
	forward: () => {},
	backward: () => {},
	// setHistoryA: () => {},
	// setHistoryB: () => {},
	// setChangesA: () => {},
	// setChangesB: () => {},
});
