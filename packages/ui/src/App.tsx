import './App.css'
import { Controls } from './components/controls'
import { Incremental } from './components/incremental'
import { Static } from './components/static'
import { CtxProvider } from './state/provider'


function App() {
  return (
    <CtxProvider>
        <div className='grid grid-cols-2 grid-rows-[max-content_minmax(0,1fr)] min-h-svh font-mono place-items-center'>
          <Controls />
          <Static />
          {/* <Incremental /> */}
        </div>
    </CtxProvider>
  )
}

export default App
