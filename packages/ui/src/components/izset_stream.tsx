import { Stream as StreamComp } from './stream_comp'
import { useMemo } from "react"
import { StreamElement } from "./stream_element"
import type { IZSet } from '@a33/tdbsp/src/objs/i_z_set'

export function IZSetStream<T extends Record<string, number>>({ data }: {
    data: readonly IZSet<number,T,number>[]
}) {

    const ZSetStreamWithKeys = useMemo(() => {
        return data.map(x => [x, Math.random().toString(36).substring(2, 15)] as const)
    }, [data])
    return (
        <div>
            <StreamComp data={ZSetStreamWithKeys as [IZSet<number,T,number>, string][]} element={(elem, key) => <StreamElement data={elem} key={key} />} />
        </div>
    )
}
