import type { HashMap } from "effect"

export type IZSet<Key, Data, W> = {
  readonly _tag: "IZSet"
  index: HashMap.HashMap<Key, HashMap.HashMap<Data, W>>
  readonly [Symbol.iterator]: () => Iterator<[Key, HashMap.HashMap<Data, W>], any, any>
}

export type ZSet<Data, W> = IZSet<0, Data, W>
