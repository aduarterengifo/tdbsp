import type { IZSet } from "@a33/tdbsp/src/objs/i_z_set";
import { HashMap as HM, Option } from "effect";
import type { ReactElement } from "react";

export function StreamElement<T extends Record<string, number>>({ data }: { data: IZSet<number, T,number>}) {
    return (
        <>
        {
            HM.map<ReactElement<any, any>,HM.HashMap<T,number>,number>((zset, k) => <div className="grid-cols-2" key={`index-${k}`}><div>{k}</div><InternalStreamElement data={zset}/></div>)(data.index)
        }
        </>
    )
}

function InternalStreamElement<T extends Record<string, number>>({ data }: { data: HM.HashMap<T,number> }) {
    const keysArray = Array.from(HM.keys(data));
    const hasData = keysArray.length > 0;

    return (
        <table className='p-2 border-red-600 border-x-2 border-collapse w-20'>
            <thead>
                <tr>
                    {hasData ? Object.keys(keysArray[0]).map(
                        (key) => (
                            <th key={`header-key-${key}-${Math.random()}`} className='text-xs border p-1'>
                                {key}
                            </th>
                        )
                    ) : (
                        <th className='text-xs border p-1'>No Data</th>
                    )}
                    {hasData && (
                        <th key={`header-key-weight-${Math.random()}`} className='text-xs border p-1'>
                            w
                        </th>
                    )}
                </tr>
            </thead>
            <tbody>
                {hasData ? keysArray.map((value, index) => (
                    <tr key={`row-${index}-${Math.random()}`}>
                        {Object.entries(value).map(([key, val]) => (
                            <td key={`cell-${key}-${Math.random()}`} className='text-xs w-16 border p-1'>
                                {val}
                            </td>
                        ))}
                        <td key={`actual-value-${index}-${Math.random()}`} className='text-xs w-16 border p-1'>
                            {Option.getOrNull(HM.get(data, value))}
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td className='text-xs w-16 border p-1' colSpan={Object.keys(keysArray[0] || {}).length + 1 || 1}>
                            No data available
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}
