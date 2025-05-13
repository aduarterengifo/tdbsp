import type { Node } from "./nodes/unions/node.js"

export const Prop44Tags = ["FilterNode", "JoinNode", "MulNode"]

export const Prop45Tags = ["MapNode", "AddNode", ...Prop44Tags]

export const isProp44Q = (node: Node<any, any, any>) => Prop44Tags.includes(node._tag)

export const isProp45Q = (node: Node<any, any, any>) => Prop45Tags.includes(node._tag)
