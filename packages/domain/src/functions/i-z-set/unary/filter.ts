import { HashMap } from "effect"
import { mapInternal } from "../abstractions/map-internal.js"

/**
 * @pointfree
 */
export const filter = <Key, Data, W>(predicate: (w: W, data: Data) => boolean) =>
  mapInternal<Key, Data, Data, W>(
    HashMap.map(
      filterInternal<Data, W>(predicate)
    )
  )

/**
 * @pointfree
 */
export const filterInternal = <Data, W>(predicate: (w: W, data: Data) => boolean) => HashMap.filter<Data, W>(predicate) // TODO: map should be enough
