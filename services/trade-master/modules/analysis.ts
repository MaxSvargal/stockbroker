import {
    always, both, composeP, cond, converge, either, equals, head, isNil, length, not, nth, o, pair,
    prop, T, tail, when, zipObj, allPass,
} from 'ramda'

import { log } from '../../utils/log'
import { makeFetchCandles } from './candles'
import { obvIsGrow, obvEmaIsGrow, cciEmaIsGrow, cciIsOverZero, wrIsJustGrow, wr7IsNotOverbought, wr14IsNotOverbought, wr14IsBeginGrow } from './indicators'
import { suitableSymbolsFromTicker } from './symbols'

type MainInput = {
  fetchTicker: () => Promise<{ symbol: string, priceChangePercent: string }[]>,
  fetchCandles: (opt: { symbol: string, interval: string, limit: number }) => Promise<any[][]>,
  fetchSymbolState: (id: string) => Promise<any>
  saveSymbolState: (state: { symbol: string }) => Promise<any>
}

// Move to module states
// TODO: reqrite it. THINK!
const propEqFalse: (a: string) => (b: {}) => boolean = converge(equals, [ always(false), prop ])
const m = (n: number): number => 1000 * 60 * n
const checkTimeOffset = cond([
  [ propEqFalse('4h'), always(m(30)) ],
  [ propEqFalse('1h'), always(m(15)) ],
  [ propEqFalse('15m'), always(m(6)) ],
  [ T, always(m(3)) ],
])
const compareTimes = ([ a, b ]: [ number, number ]) => Date.now() - b > new Date(a).getTime()
const needToCheck = either(isNil, o(compareTimes, converge(pair, [ prop('timestamp'), checkTimeOffset ])))
const zipSymbolState = zipObj([ 'timestamp', 'symbol', '4h', '1h', '15m' ])

const computeState = ([ symbol, candles ]: [ string, number[][] ]) =>
  zipSymbolState([
    Date.now(),
    symbol,
    o(allPass([ obvEmaIsGrow, cciEmaIsGrow, cciIsOverZero, wr7IsNotOverbought ]), nth(0), candles),
    o(allPass([ obvEmaIsGrow, wrIsJustGrow, wr14IsNotOverbought ]), nth(1), candles),
    o(allPass([ obvIsGrow, wr14IsBeginGrow ]), nth(2), candles),
  ])

const isNotLastIteration = o(o(not, equals(1)), length)

type FetchReqs = { fetchSymbolState: Function, fetchCandles: Function, saveSymbolState: Function }
export const fetchCandlesRecursively = (requests: FetchReqs) =>
  async (symbols: string[]): Promise<any> => {
    const { fetchSymbolState, fetchCandles, saveSymbolState } = requests
    const doFetch = fetchCandlesRecursively(requests)
    const symbol = head(symbols) as string
    const currState = await fetchSymbolState(symbol)

    if (needToCheck(currState)) {
      await composeP(o(saveSymbolState, computeState), makeFetchCandles(fetchCandles))(symbol)
    }
    return when(isNotLastIteration, o(doFetch, tail))(symbols)
  }

export default async (requests: MainInput) => {
  const ticker = await requests.fetchTicker()
  const symbols = suitableSymbolsFromTicker([ 'BTC', ticker ])
  await fetchCandlesRecursively(requests)(symbols)
  log('Checking complete.')
}
