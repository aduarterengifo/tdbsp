import type { HashMap as HM } from "effect"
import { Option } from "effect"
import type { IZSet } from "../../../objs/i-z-set.js"
import { foldOptional as hashFoldOptional } from "../../hashmap/n-ary/fold.js"
import { make } from "../make.js"

export const foldOptional = <K, D, W>(
  f: (a: Option.Option<HM.HashMap<D, W>>, b: HM.HashMap<D, W>) => Option.Option<HM.HashMap<D, W>>
) =>
(
  iZSets: Array<IZSet<K, D, W>>
): IZSet<K, D, W> => make<K, D, W>(hashFoldOptional<K, HM.HashMap<D, W>>(f)(iZSets.map((x) => x.index)))

export const fold = <K, D, W>(
  f: (a: HM.HashMap<D, W>, b: HM.HashMap<D, W>) => HM.HashMap<D, W>
) =>
  foldOptional<K, D, W>((a, b) =>
    Option.match(a, {
      onSome: (existingValue) => Option.some(f(existingValue, b)),
      onNone: () => Option.some(b)
    })
  )
