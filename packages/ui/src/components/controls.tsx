import { Ctx } from "../state/ctx"
import { useContext } from "react"

export function Controls() {
    const { time, forward } = useContext(Ctx)
    return (<div className='col-span-2'>
        <div className="flex flex-row gap-4">
            <div>{time}</div>
            <button type="button" onClick={() => forward()} className="cursor-pointer">forward</button>
        </div>
    </div>)
}
