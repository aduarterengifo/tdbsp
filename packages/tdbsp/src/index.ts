
export * as TodosApi from "./TodosApi.js"


export * as a from "./data/a.js"


export * as b from "./data/b.js"


export * as c from "./data/c.js"


export * as example from "./examples/delta/example.js"


export * as example-run from "./examples/delta/example-run.js"


export * as floppy from "./floppy.js"


export * as add from "./functions/hashmap/binary/add.js"


export * as map-keys from "./functions/hashmap/map-keys.js"

/**
 * maybe conditional is a better name.
 */
export * as merge from "./functions/hashmap/merge.js"


export * as merge-alt from "./functions/hashmap/merge-alt.js"


export * as fold from "./functions/hashmap/n-ary/fold.js"

/**
 * @pointfree
 */
export * as distinct from "./functions/hashmap/unary/distinct.js"


export * as get-or-default from "./functions/hashmap/unary/get-or-default.js"


export * as get-or-empty from "./functions/hashmap/unary/get-or-empty.js"


export * as set-inner from "./functions/hashmap/unary/set-inner.js"


export * as deep-fold-internal from "./functions/i-z-set/abstractions/deep-fold-internal.js"

/**
 * core abstraction
 * returns a z-set with the function applied to the underlying hashmap.
 */
export * as deep-map-internal from "./functions/i-z-set/abstractions/deep-map-internal.js"

/**
 * operates on internal hashmap structure
 */
export * as fold-internal from "./functions/i-z-set/abstractions/fold-internal.js"

/**
 * core abstraction
 * returns a z-set with the function applied to the underlying hashmap.
 */
export * as map-internal from "./functions/i-z-set/abstractions/map-internal.js"


export * as merge from "./functions/i-z-set/abstractions/merge.js"


export * as add from "./functions/i-z-set/binary/add.js"

/**
 * @returns elements in self but not in other.
 */
export * as except from "./functions/i-z-set/binary/except.js"


export * as h from "./functions/i-z-set/binary/h.js"


export * as join from "./functions/i-z-set/binary/join.js"

/**
 * @immutable
 * does secret hush hush lightweight mutations.
 */
export * as mul from "./functions/i-z-set/binary/mul.js"

/**
 * @predicate
 */
export * as equals from "./functions/i-z-set/binary/predicates/equals.js"


export * as sub from "./functions/i-z-set/binary/sub.js"

/**
 * 'lifts' a function f: A -> B to the stream operator ↑f: S_A -> S_B
 * by lifting it point-wise in time.
 */
export * as lift from "./functions/i-z-set/lift.js"


export * as make from "./functions/i-z-set/make.js"

/**
 * @pointfree
 */
export * as aggregate from "./functions/i-z-set/unary/aggregate.js"


export * as deindex from "./functions/i-z-set/unary/deindex.js"

/**
 * @pointfree
 */
export * as distinct from "./functions/i-z-set/unary/distinct.js"

/**
 * @pointfree
 */
export * as filter from "./functions/i-z-set/unary/filter.js"


export * as flatten from "./functions/i-z-set/unary/flatten.js"

/**
 * @leaks
 * it doesn't really make sense to want to have the data for any keys, because you could get duplicates, which is much more niche?
 */
export * as get-weight from "./functions/i-z-set/unary/leak/get-weight.js"

/**
 * @leaks
 */
export * as get-zset from "./functions/i-z-set/unary/leak/get-zset.js"

/**
 * @immutable
 * @leaks
 */
export * as set-data from "./functions/i-z-set/unary/leak/set-data.js"

/**
 * @immutable
 * @leaks
 */
export * as set-zset from "./functions/i-z-set/unary/leak/set-zset.js"

/**
 * @pointfree
 */
export * as map from "./functions/i-z-set/unary/map.js"

/**
 * @pointfree
 */
export * as negate from "./functions/i-z-set/unary/negate.js"

/**
 * @pointfree
 */
export * as positive from "./functions/i-z-set/unary/positive.js"

/**
 * @predicate
 * if all keys of the IZet point to empty Zset we also consider the IZet empty.
 */
export * as isEmpty from "./functions/i-z-set/unary/predicate/isEmpty.js"

/**
 * Produces an output stream by delaying its input stream by one step.
 */
export * as delay from "./functions/streams/abelian-group/delay.js"

/**
 * The unique operator satisfying s + z^-1(a)  = a
 */
export * as diff from "./functions/streams/abelian-group/diff.js"

/**
 * Produces an output stream by delaying its input stream by one step.
 */
export * as delay from "./functions/streams/abelian-group/i-zset-stream/delay.js"

/**
 * differentiation
 */
export * as diff from "./functions/streams/abelian-group/i-zset-stream/diff.js"

/**
 * integration
 */
export * as int from "./functions/streams/abelian-group/i-zset-stream/int.js"

/**
 * The unique operator satisfying s + z^-1(a)  = a
 */
export * as int from "./functions/streams/abelian-group/int.js"


export * as equals from "./functions/streams/equals.js"

/**
 * executes the computation graph.
 */
export * as exec from "./functions/streams/graph/exec.js"


export * as add from "./functions/streams/graph/nodes/add.js"


export * as de-index from "./functions/streams/graph/nodes/de-index.js"


export * as distinct from "./functions/streams/graph/nodes/distinct.js"


export * as end from "./functions/streams/graph/nodes/end.js"


export * as filter from "./functions/streams/graph/nodes/filter.js"


export * as join from "./functions/streams/graph/nodes/join.js"


export * as map from "./functions/streams/graph/nodes/map.js"


export * as mul from "./functions/streams/graph/nodes/mul.js"


export * as stream from "./functions/streams/graph/nodes/stream.js"


export * as sub from "./functions/streams/graph/nodes/sub.js"


export * as union from "./functions/streams/graph/nodes/union.js"


export * as node from "./functions/streams/graph/nodes/unions/node.js"


export * as spec from "./functions/streams/graph/spec.js"


export * as distinct from "./functions/streams/i-z-sets/delta/distinct.js"


export * as join from "./functions/streams/i-z-sets/delta/join.js"


export * as lifted-h from "./functions/streams/i-z-sets/lifted-h.js"


export * as utils from "./functions/streams/i-z-sets/utils.js"


export * as lifted-add from "./functions/streams/lifted-add.js"


export * as lifted-de-index from "./functions/streams/lifted-de-index.js"


export * as lifted-distinct from "./functions/streams/lifted-distinct.js"


export * as lifted-filter from "./functions/streams/lifted-filter.js"


export * as lifted-index from "./functions/streams/lifted-index.js"


export * as lifted-join from "./functions/streams/lifted-join.js"


export * as lifted-map from "./functions/streams/lifted-map.js"


export * as lifted-multiply from "./functions/streams/lifted-multiply.js"


export * as lifted-sub from "./functions/streams/lifted-sub.js"

/**
 *  takes in an execution plan and *executes* it lol
 * another name for an execution plan can be a *language*
 */
export * as stream-plan from "./functions/streams/stream-plan.js"


export * as union from "./functions/streams/union.js"

/**
 * additive identity       (0)
 * add                     (+)
 * substract               (-)
 * associativity
 * commutativity
 */
export * as abelian-group from "./objs/abelian-group.js"


export * as i-z-set from "./objs/abelian-groups/i-z-set.js"


export * as i-z-set from "./objs/i-z-set.js"

/**
 * multiplicative identity (1)
 * additive identity       (0)
 * addition                (+)
 * additive inverse        (-)
 * multiplication          (*)
 */
export * as ring from "./objs/ring.js"


export * as ring from "./objs/utils/ring.js"


export * as z from "./objs/z.js"
