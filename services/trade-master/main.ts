import { flip, invoker, map, applyTo, o, prop } from 'ramda'
import { Stream, periodic, observe } from 'most'
import { Requester } from 'cote'

import { symbols, ticker, candles } from './modules/exchangeRequests'
import analysis from './modules/analysis'
import { log } from '../utils/log'

const invokeSend = flip(invoker(1, 'send'))

const replaceInfoSymbols = (data: {}[]) =>
  ({ type: 'dbReplaceAll', table: 'exchangeInfoSymbols', primaryKey: 'symbol', data })

const getSymbolsState = (id: string) =>
  ({ type: 'dbGet', table: 'symbolsState', id })

const setSymbolsState = (data: { symbol: string }) => {
  log(`Rechecked ${data.symbol} -> [ ${data['4h']} ${data['1h']} ${data['15m']} ]`)
  return ({ type: 'dbReplace', table: 'symbolsState', id: prop('symbol', data), data })
}

type ExitProcess = (a: Error) => void
type Main = (a: ExitProcess, b: Stream<{}>, c: typeof fetch, d: Requester, e: Requester) => void
const main: Main = (exitProcess, mainLoopStream, fetch, requesterDb) => {
  const db = invokeSend(requesterDb)
  const fetchSymbolState = o(db, getSymbolsState)
  const saveSymbolState = o(db, setSymbolsState)

  type ApplyToFetch = (a: Function) => (a?: any) => Promise<any>
  const [ fetchSymbols, fetchTicker, fetchCandles ] = map(<ApplyToFetch>applyTo(fetch), [ symbols, ticker, candles ])
  
  fetchSymbols().then(o(db, replaceInfoSymbols)).catch(exitProcess)

  const tick = () =>
    analysis({ fetchTicker, fetchCandles, fetchSymbolState, saveSymbolState })
      .catch(exitProcess)

  observe(tick, mainLoopStream)
}

export default main