import type { PropsWithChildren, ReactNode } from "react";

export function Stream<T>({ data, element }: { data: [T, string][], element: (props: T, k: string) => ReactNode } & PropsWithChildren) {
    return (<div className="relative h-40 w-96 border-amber-500">
        <div className="overflow-x-scroll overflow-y-hidden flex flex-row">
            {data.map(([x, y]) => element(x, y))}
        </div>
    </div>)
}
