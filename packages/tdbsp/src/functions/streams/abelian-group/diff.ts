import type { Stream } from "effect"
import type { AbelianGroup } from "../../../objs/abelian_group.js"
import { binaryLift } from "../../i_z_set/lift.js"
import { aGDelayOp } from "./delay.js"

// TODO: investigate definition using unfold.
/**
 * The unique operator satisfying s + z^-1(a)  = a
 */
export const aGDiffOp = <T>(aG: AbelianGroup<T>) => (s: Stream.Stream<T>) =>
  binaryLift((a: T, b: T) => aG.sub(a, b))(s)(aGDelayOp(aG)(s))
