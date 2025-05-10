import { Chunk, Effect, HashMap as HM, pipe, Stream } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import { foldInternal } from "../../i-z-set/abstractions/fold-internal.js"

export const logStream = <K, D0, W>(s: Stream.Stream<IZSet<K, D0, W>>) =>
  Effect.gen(function*() {
    const chunk = yield* Stream.runCollect(s)
    const arr = Chunk.toReadonlyArray(chunk)

    yield* Effect.logInfo(arr.map((v) => IZSetPretty(v)).join(" "))
  })

export const IZSetPretty = <K, D, W>(self: IZSet<K, D, W>) =>
  pipe(
    (map: HM.HashMap<K, HM.HashMap<D, W>>) =>
      HM.reduce<string, HM.HashMap<D, W>, K>("", (acc, value, key) =>
        `${acc}\nkey: ${key}\n${
          HM.reduce<string, W, D>("", (acc, w, data) =>
            `${JSON.stringify(data, null, 2)}\n${w}`)(value)
        }`)(map),
    foldInternal<K, D, W, string>
  )(self)
