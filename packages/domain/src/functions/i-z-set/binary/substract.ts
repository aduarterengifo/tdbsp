import { HashMap as HM, Option } from "effect"
import { beginMutation } from "effect/HashMap"
import type { IZSet } from "../../../objs/i-z-set.js"
import type { Ring } from "../../../objs/ring.js"

export const substract =
  <Key, Data, W>(ring: Ring<W>) => (other: IZSet<Key, Data, W>) => (self: IZSet<Key, Data, W>) => {
    const union = new Set([...HM.keys(self.index), ...HM.keys(other.index)])
    union.forEach((key) => {
      const [a, b] = [self, other].map((x) => HM.get(x.index, key))

      Option.match(a, {
        onSome: (a) =>
          Option.match(b, {
            onSome: (b) => substractInternal(ring)(a)(b),
            onNone: () => a
          }),
        onNone: () => b
      })
    })
  }

export const substractInternal =
  <Data, W>(ring: Ring<W>) => (other: HM.HashMap<Data, W>) => (self: HM.HashMap<Data, W>) => {
    let result: HM.HashMap<Data, W> = beginMutation(self)
    HM.forEach(
      other,
      (v, k) => {
        result = HM.modifyAt<Data, W>(result, k, (existingValue) => {
          const sum = ring.add(Option.getOrElse(existingValue, () => ring.zero), v)
          return sum !== 0 ? Option.some(sum) : Option.none()
        })
      }
    )

    return result
  }
