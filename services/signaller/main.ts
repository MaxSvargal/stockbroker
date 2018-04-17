import { Requester, Publisher } from 'cote'
import { observe, Stream } from 'most'
import { curry, flip, invoker, map, o, concat, zip, converge, without, apply, difference, head } from 'ramda'
import { log, error } from '../utils/log'

import makeAnalysisBuys from './modules/checkBuy'
import makeAnalysisSells from './modules/checkSell'

const limit = 40
const requestSymbolsToBuy = {
  type: 'dbFilterAllRowsConcat',
  table: 'symbolsState',
  filter: { '4h': true, '1h': true, '15m': true },
  row: 'symbol',
}
const requestSymbolsOfGrow = {
  type: 'dbFilterAllRowsConcat',
  table: 'symbolsState',
  filter: { '4h': true },
  row: 'symbol',
}
const requestSymbolsOfAccounts = {
  type: 'dbFilterAllRowsConcat',
  table: 'positions',
  filter: { 'closed': false },
  row: 'symbol',
}

const invokeSend = flip(invoker(1, 'send'))
const invokePublish = invoker(2, 'publish')
const invokePublishNewSignal = flip(invokePublish('newSignal'))
const similarity = converge(without, [ apply(difference), head ])

const makeGetCandles = curry((fetch: Function, limit: number, interval: string, symbol: string) =>
  fetch(`https://binance.com/api/v1/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`)
    .then((res: Response) => res.json())
    .catch((err: Error) => console.error(err)))

type Binance = { candles: (a: string) => Promise<{}[]> }
type Symbol = string
type ExitProcess = (a: Error) => void
type Main = (a: ExitProcess, b: Stream<{}>, c: Requester, d: Publisher, e: Function) => void

const main: Main = (exitProcess, mainLoopStream, requester, publisher, fetch) => {
  const publishSignals = map(invokePublishNewSignal(publisher))
  const request = invokeSend(requester) as (a: {}) => Promise<any>
  const fetchCandles = makeGetCandles(fetch, limit)

  const iterate = async () => {
    try {
      const [ symbolsToBuy, symbolsOfAccounts, symbolsOfGrow ] = await Promise.all([
        request(requestSymbolsToBuy),
        request(requestSymbolsOfAccounts),
        request(requestSymbolsOfGrow),
      ])
      const symbolsToSell: any[] = similarity([ symbolsOfGrow, symbolsOfAccounts ])
      const candlesForBuy = await Promise.all(map(fetchCandles('1m'), symbolsToBuy))
      const candlesForSell = await Promise.all(map(fetchCandles('5m'), symbolsToSell))
      const buysSignals = makeAnalysisBuys(zip(symbolsToBuy, candlesForBuy))
      const sellsSignals = makeAnalysisSells(zip(symbolsToSell, candlesForSell))

      log('Symbols to buy: %o', symbolsToBuy)
      log('Symbols to sell: %o', symbolsToSell)
      log('Signals: \n%O', concat(buysSignals, sellsSignals))

      return publishSignals(concat(buysSignals, sellsSignals))
    } catch (err) {
      error(err)
      return exitProcess(err)
    }
  }

  observe(iterate, mainLoopStream)
}

export default main
