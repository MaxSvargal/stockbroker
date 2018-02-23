import { flip, invoker, map, applyTo, o } from 'ramda'
import { Stream, periodic, observe } from 'most'
import { Requester } from 'cote'

import { symbols, ticker, candles } from './modules/exchangeRequests'
import analysis from './modules/analysis'

const invokeSend = flip(invoker(1, 'send'))

const replaceInfoSymbols = (data: {}[]) =>
  ({ type: 'dbReplaceAll', table: 'exchangeInfoSymbols', primaryKey: 'symbol', data })

const updateSymbolsEnabled = (values: string[]) =>
  ({ type: 'dbUpdate', table: 'tradeState', id: 'symbolsEnabled', data: { values } })

const processStartSignaller = (symbol: string) => ({
  type: 'processStart',
  options: {
    name: `Signaller ${symbol}`,
    script: `./services/signaller/index.ts`,
    max_memory_restart: '120M',
    env: { SYMBOL: symbol, DEBUG: 'app:log,app:error' }
  }
})

type ExitProcess = (a: Error) => void
type Main = (a: ExitProcess, b: Stream<{}>, c: typeof fetch, d: Requester, e: Requester) => void
const main: Main = (exitProcess, mainLoopStream, fetch, requesterProcess, requesterDb) => {
  const processes = invokeSend(requesterProcess)
  const db = invokeSend(requesterDb)
  const setEnabledSymbols = o(db, updateSymbolsEnabled)
  const startSignallerProcess = o(processes, processStartSignaller)

  type ApplyToFetch = (a: Function) => (a?: any) => Promise<any>
  const [ fetchSymbols, fetchTicker, fetchCandles ] = map(<ApplyToFetch>applyTo(fetch), [ symbols, ticker, candles ])

  fetchSymbols().then(o(db, replaceInfoSymbols)).catch(exitProcess)

  const tick = () =>
    analysis({ fetchTicker, fetchCandles, setEnabledSymbols, startSignallerProcess })
      .catch(exitProcess)

  observe(tick, mainLoopStream)
}

export default main