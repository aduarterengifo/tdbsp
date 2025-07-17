export type ScalarWrap<W> = {
  readonly _tag: "scalar"
  readonly value: W
}
