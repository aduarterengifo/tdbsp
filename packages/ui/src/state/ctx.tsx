// import { createContext } from 'react';
// import { IZSet } from "@a33/tdbsp/objs/i-z-set"


// import { Stream } from 'effect';

// export type CTX = {
// 	time: number;
// 	streamA: Stream.Stream<IZSet<BaseA>>;
// 	streamB: Stream.Stream<ZSetObj<BaseB>>;
// 	streamAChanges: Stream.Stream<ZSetObj<BaseA>>;
// 	streamBChanges: Stream.Stream<ZSetObj<BaseB>>;
// 	streamIncremental: Stream.Stream<ZSetObj<{ x: number; y: number }>>;
// 	streamStatic: Stream.Stream<ZSetObj<{ x: number; y: number }>>;
// 	historyA: readonly ZSetObj<BaseA>[];
// 	historyB: readonly ZSetObj<BaseB>[];
// 	changesA: readonly ZSetObj<BaseA>[];
// 	changesB: readonly ZSetObj<BaseB>[];
// 	staticResult: readonly ZSetObj<{ x: number; y: number }>[];
// 	incrementalResult: readonly ZSetObj<{ x: number; y: number }>[];
// 	setTime: (f: (x: number) => number) => void;
// 	setStreamA: (
// 		f: (x: Stream.Stream<ZSetObj<BaseA>>) => Stream.Stream<ZSetObj<BaseA>>,
// 	) => void;
// 	setStreamB: (
// 		f: (x: Stream.Stream<ZSetObj<BaseB>>) => Stream.Stream<ZSetObj<BaseB>>,
// 	) => void;
// 	setStreamAChanges: (
// 		f: (x: Stream.Stream<ZSetObj<BaseA>>) => Stream.Stream<ZSetObj<BaseA>>,
// 	) => void;
// 	setStreamBChanges: (
// 		f: (x: Stream.Stream<ZSetObj<BaseB>>) => Stream.Stream<ZSetObj<BaseB>>,
// 	) => void;
// 	setStreamIncremental: (
// 		f: (
// 			x: Stream.Stream<ZSetObj<{ x: number; y: number }>>,
// 		) => Stream.Stream<ZSetObj<{ x: number; y: number }>>,
// 	) => void;
// 	setStreamStatic: (
// 		f: (
// 			x: Stream.Stream<ZSetObj<{ x: number; y: number }>>,
// 		) => Stream.Stream<ZSetObj<{ x: number; y: number }>>,
// 	) => void;
// 	forward: () => void;
// 	backward: () => void;
// 	// setHistoryA: (f: (x: ZSetObj<BaseA>) => ZSetObj<BaseA>) => void;
// 	// setHistoryB: (f: (x: ZSetObj<BaseB>) => ZSetObj<BaseB>) => void;
// 	// setChangesA: (f: (x: ZSetObj<BaseA>) => ZSetObj<BaseA>) => void;
// 	// setChangesB: (f: (x: ZSetObj<BaseB>) => ZSetObj<BaseB>) => void;
// };

// export const Ctx = createContext<CTX>({
// 	time: 0,
// 	streamA: Stream.empty,
// 	streamB: Stream.empty,
// 	streamAChanges: Stream.empty,
// 	streamBChanges: Stream.empty,
// 	streamIncremental: Stream.empty,
// 	streamStatic: Stream.empty,
// 	historyA: [],
// 	historyB: [],
// 	changesA: [],
// 	changesB: [],
// 	staticResult: [],
// 	incrementalResult: [],
// 	setTime: () => {},
// 	setStreamA: () => {},
// 	setStreamB: () => {},
// 	setStreamAChanges: () => {},
// 	setStreamBChanges: () => {},
// 	setStreamIncremental: () => {},
// 	setStreamStatic: () => {},
// 	forward: () => {},
// 	backward: () => {},
// 	// setHistoryA: () => {},
// 	// setHistoryB: () => {},
// 	// setChangesA: () => {},
// 	// setChangesB: () => {},
// });
