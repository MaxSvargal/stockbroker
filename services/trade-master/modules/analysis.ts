import {
  curryN, o, equals, cond, always, either, isNil, converge, pair, prop,
  composeP, tail, head, when, nth, T, not, length, both, zipObj
} from 'ramda'

import { log } from '../../utils/log'
import { suitableSymbolsFromTicker } from './symbols'
import { makeFetchCandles } from './candles'
import { wrIsJustGrow, wrIsStartedGrow, obvIsGrow, cciIsGrow } from './indicators'

type MainInput = {
  fetchTicker: () => Promise<{ symbol: string, priceChangePercent: string }[]>,
  fetchCandles: (opt: { symbol: string, interval: string, limit: number }) => Promise<any[][]>,
  fetchSymbolState: (id: string) => Promise<any>
  saveSymbolState: (state: { symbol: string }) => Promise<any>
}

// Move to module states
// TODO: reqrite it. THINK!
const m = n => 1000 * 60 * n
const checkTimeOffset = cond([
  [ o(equals(false), prop('4h')), always(m(50)) ],
  [ o(equals(false), prop('1h')), always(m(30)) ],
  [ o(equals(false), prop('15m')), always(m(10)) ],
  [ T, always(m(3)) ]
])
const compareTimes = ([ a, b ]: [ number, number ]) => Date.now() - b > new Date(a).getTime()
const needToCheck = either(isNil, o(compareTimes, converge(pair, [ prop('timestamp'), checkTimeOffset ])))
const zipSymbolState = zipObj([ 'timestamp', 'symbol', '4h', '1h', '15m' ])

const computeState = ([ symbol, candles ]: [ string, number[][] ]) =>
  zipSymbolState([
    Date.now(),
    symbol,
    o(both(obvIsGrow, wrIsJustGrow), nth(0), candles),
    o(both(obvIsGrow, wrIsStartedGrow), nth(1), candles),
    o(both(obvIsGrow, cciIsGrow), nth(2), candles)
  ])

const isNotLastIteration = o(o(not, equals(1)), length)

type FetchReqs = { fetchSymbolState: Function, fetchCandles: Function, saveSymbolState: Function }
export const fetchCandlesRecursively = (requests: FetchReqs) =>
  async (symbols: string[]): Promise<any> => {
    const { fetchSymbolState, fetchCandles, saveSymbolState } = requests
    const doFetch = fetchCandlesRecursively(requests)
    const symbol = head(symbols)
    const currState = await fetchSymbolState(symbol)

    if (needToCheck(currState))
      await composeP(o(saveSymbolState, computeState), makeFetchCandles(fetchCandles))(symbol)
    return when(isNotLastIteration, o(doFetch, tail))(symbols)
  }

export default async (requests: MainInput) => {
  const ticker = await requests.fetchTicker()
  const symbols = suitableSymbolsFromTicker([ 'BTC', ticker ])
  await fetchCandlesRecursively(requests)(symbols)
  log('Checking complete.')
}
