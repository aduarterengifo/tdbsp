import type { HashMap as HM } from "effect"
import { Option, pipe } from "effect"
import type { IZSet } from "../../../objs/i_z_set.js"
import { foldOptional as hashFoldOptional } from "../../hashmap/n_ary/fold.js"
import { make } from "../make.js"

export const foldOptional = <K, D, W>(
  f: (a: Option.Option<HM.HashMap<D, W>>, b: HM.HashMap<D, W>) => Option.Option<HM.HashMap<D, W>>
) =>
(
  iZSets: Array<IZSet<K, D, W>>
): IZSet<K, D, W> =>
  pipe(
    iZSets.map((x) => x.index),
    hashFoldOptional<K, HM.HashMap<D, W>>(f),
    make<K, D, W>
  )

export const fold = <K, D, W>(
  f: (a: HM.HashMap<D, W>, b: HM.HashMap<D, W>) => HM.HashMap<D, W>
) =>
  foldOptional<K, D, W>((a, b) =>
    Option.match(a, {
      onSome: (existingValue) => Option.some(f(existingValue, b)),
      onNone: () => Option.some(b)
    })
  )
