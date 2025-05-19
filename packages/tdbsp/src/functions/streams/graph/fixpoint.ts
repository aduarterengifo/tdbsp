import { delayNodeMake } from "./nodes/delay.js"
import type { Node } from "./nodes/unions/node.js"

export const fixPoint = <K, D0, W>(
  f: (input: Node<K, D0, W>) => Node<K, D0, W>
): Node<K, D0, W> => {
  const delayed = delayNodeMake<K, D0, W>()({ children: [] as unknown as [Node<K, D0, W>] })

  const body = f(delayed)

  delayed.children = [body]

  return delayed
}
