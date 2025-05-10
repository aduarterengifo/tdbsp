import { HashMap } from "effect"
import { getOrEmpty } from "./get-or-empty.js"

export const setInner =
  <Key, Data, W>(key: Key, data: Data, w: W) => (self: HashMap.HashMap<Key, HashMap.HashMap<Data, W>>) =>
    HashMap.set(
      self,
      key,
      HashMap.set(
        getOrEmpty<Key, Data, W>(key)(self),
        data,
        w
      )
    )
