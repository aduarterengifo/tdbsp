import type { Node } from "./nodes/unions/node.js"

export const Prop45Tags = ["MapNode", "AddNode", "FilterNode", "JoinNode", "MulNode"]

export const isProp45Q = (node: Node<any, any, any>) => Prop45Tags.includes(node._tag)
