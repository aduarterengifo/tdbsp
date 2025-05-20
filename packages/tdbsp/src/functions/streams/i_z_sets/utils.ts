import { Chunk, Effect, HashMap as HM, pipe, Stream } from "effect"
import type { IZSet } from "../../../objs/i_z_set.js"
import { foldInternal } from "../../i_z_set/abstractions/fold_internal.js"

// Improved logStream to show clear divisions between stream elements
export const logStream = <K, D0, W>(s: Stream.Stream<IZSet<K, D0, W>>) =>
  Effect.gen(function*() {
    const chunk = yield* Stream.runCollect(s)
    const arr = Chunk.toReadonlyArray(chunk)

    // Use a clear separator between stream elements
    const prettyArr = arr.map((v, i) =>
      [
        `--- Stream Element #${i} ---`,
        IZSetPretty(v)
      ].join("\n")
    )

    yield* Effect.logInfo([
      "===",
      ...prettyArr,
      "==="
    ].join("\n"))
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
