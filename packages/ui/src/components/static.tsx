import { useContext } from "react"
import { Ctx } from "../state/ctx"
import { IZSetStream } from "./izset_stream"

export function Static() {
    const { historyA, historyB, staticResult } = useContext(Ctx)
    // const dataA = sampleBaseA(10)
    // const dataB = sampleBaseB(10)

    // function generateRandomString() {
    //     return Math.random().toString(36).substring(2, 8);
    // }

    // console.log('dataA', dataA)

    return (
        <div className='flex flex-col gap-2'>
            <div className='font-semibold text-lg'>static</div>
            {/* <Stream data={historyA.map(x => [x, generateRandomString()])} element={(data, key) => <StreamElement data={data} key={key} />} />
            <Stream data={historyB.map(x => [x, generateRandomString()])} element={(data, key) => <StreamElement data={data} key={key} />} /> */}
            <div>a</div>
            <IZSetStream data={historyA} />
            <div>b</div>
            <IZSetStream data={historyB} />
            <pre className="text-xs">
                {`
SELECT DISTINCT a . x , b . y FROM ( 
    SELECT t 1 . x , t 1 . i d FROM t 1 WHERE t 1 . a > 2 
) a JOIN ( 
    SELECT t 2 . i d , t 2 . y FROM t 2 WHERE t 2 . s > 5 
) b ON a . i d = b . i d
                `}
            </pre>
            <IZSetStream data={staticResult} />
            {/* CIRCUIT RESULT  */}
            {/* <Stream data={dataB} element={(data, key) => <StreamElement data={data} key={key} />} /> */}
        </div>
    )
}
