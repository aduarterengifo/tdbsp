import type { HashMap } from "effect"

export type IZSet<Key, T> = {
  readonly _tag: "IZSet"
  index: HashMap.HashMap<Key, HashMap.HashMap<T, number>>
}

export type ZSet<T> = IZSet<void, T>
