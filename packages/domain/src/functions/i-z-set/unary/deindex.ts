import { flatten } from "./flatten.js"

export const deindex = <K, D0, W>() => flatten<K, D0, D0, W>((k, d) => d)
