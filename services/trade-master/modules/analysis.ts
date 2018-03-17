import {
  curryN, o, equals, cond, always, either, isNil, converge, pair, prop,
  composeP, tail, head, when, nth, T, not, length, both, zipObj, allPass
} from 'ramda'

import { log } from '../../utils/log'
import { suitableSymbolsFromTicker } from './symbols'
import { makeFetchCandles } from './candles'
import { wrIsStartedGrow, obvIsGrow, cciIsGrow } from './indicators'

type MainInput = {
  fetchTicker: () => Promise<{ symbol: string, priceChangePercent: string }[]>,
  fetchCandles: (opt: { symbol: string, interval: string, limit: number }) => Promise<any[][]>,
  fetchSymbolState: (id: string) => Promise<any>
  saveSymbolState: (state: { symbol: string }) => Promise<any>
}

// Move to module states
// TODO: reqrite it. THINK!
const propEqFalse: (a: string) => (b: {}) => boolean = converge(equals, [ always(false), prop ])
const m = n => 1000 * 60 * n
const checkTimeOffset = cond([
  [ propEqFalse('4h'), always(m(30)) ],
  [ propEqFalse('1h'), always(m(15)) ],
  [ propEqFalse('15m'), always(m(6)) ],
  [ T, always(m(3)) ]
])
const compareTimes = ([ a, b ]: [ number, number ]) => Date.now() - b > new Date(a).getTime()
const needToCheck = either(isNil, o(compareTimes, converge(pair, [ prop('timestamp'), checkTimeOffset ])))
const zipSymbolState = zipObj([ 'timestamp', 'symbol', '4h', '1h', '15m' ])

const computeState = ([ symbol, candles ]: [ string, number[][] ]) =>
  zipSymbolState([
    Date.now(),
    symbol,
    o(both(obvIsGrow, cciIsGrow), nth(0), candles),
    o(both(obvIsGrow, cciIsGrow), nth(1), candles),
    o(both(obvIsGrow, wrIsStartedGrow), nth(2), candles)
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
