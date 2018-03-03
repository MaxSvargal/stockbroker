import {
  unapply, converge, filter, o, contains, head, always, prop, last, reverse, pair, lt, equals,
  sortBy, take, compose, map, merge, identity, objOf, nth, assoc, mergeAll, allPass, zip, of, gt,
  apply, takeLast, any, both, init, slice, addIndex, mapAccum
} from 'ramda'
import { williamsr, bollingerbands } from 'technicalindicators'
import { log } from '../../utils/log'

const mainCurrency = 'ETH'
const symbolsNumForAnalysis = 30
const limit = 28
const interval = '15m'

type MainInput = {
  fetchTicker: () => Promise<{ symbol: string, priceChangePercent: string }[]>,
  fetchCandles: (opt: { symbol: string, interval: string, limit: number }) => Promise<any[][]>,
  setEnabledSymbols: (list: string[]) => Promise<any>,
  startSignallerProcess: (symbol: string) => Promise<any>
}

const symbolContains = converge(o, [ o(contains, head), always(prop('symbol')) ])
const filterByCurrency = unapply(converge(filter, [ symbolContains, last ]))
const sortByChangePerc = o(reverse, sortBy(o(parseFloat, prop<string>('priceChangePercent'))))
const getFitTickers = compose(map(prop<string>('symbol')), take(symbolsNumForAnalysis), sortByChangePerc, filterByCurrency)
const makeCandlesRequests = map(converge(merge, [ always({ interval, limit }), objOf('symbol') ]))

const objHigh = o(objOf('high'), map(o(parseFloat, nth(2))))
const objLow = o(objOf('low'), map(o(parseFloat, nth(3))))
const objClose = o(objOf('close'), map(o(parseFloat, nth(4))))
const objValues = o(objOf('values'), map(o(parseFloat, nth(4))))
const assocPeriod = assoc('period')
const assocStdDev = assoc('stdDev')
const prepareCandlesToWR = converge(unapply(mergeAll), [ objLow, objClose, objHigh ])
const calcWR = compose(williamsr, assocPeriod(14), prepareCandlesToWR)
const calcBB = compose(bollingerbands, assocPeriod(21), assocStdDev(2), objValues)

const groupBy3 = (a: any, b: any, i: number, xs: any[]) => [ init(xs), slice(i, i + 3, xs) ]
const mapAccumIndexed = addIndex(mapAccum)
const groupBy3Offset = compose(slice(0, -2), last, mapAccumIndexed(groupBy3, 0), takeLast(5))
const checkWr = allPass([ o(gt(-80), nth(0)), o(lt(-80), nth(1)), o(lt(-80), nth(2)), converge(lt, [ nth(1), nth(2) ]) ])
const anyWrPairIsPositive = o(<any>any(equals(true)), map(checkWr))
const isProgressOfLastValues = converge(gt, [ o(last, last), o(last, head) ])
const wrAnyIsOver = any(lt(-20))
const wrIsPositive = both(wrAnyIsOver, o(both(anyWrPairIsPositive, isProgressOfLastValues), groupBy3Offset))

const bbIsPositive = any(gt(0.1))
const areIndicatorsPositive = o(map(both(o(wrIsPositive, head), o(bbIsPositive, last))), apply(zip))
const getTruthSymbols = o(map(head), filter(o(equals(true), last)))

export const analyzer = (symbols: string[], candles: number[][]): string[] => {
  const wrs = map(o(takeLast(14), calcWR), candles)
  const bbs = map(compose(takeLast(7), map(prop('pb')), calcBB), candles)
  const states: boolean[] = areIndicatorsPositive([ wrs, bbs ])
  const enabled: string[] = getTruthSymbols(zip(symbols, states))

  log(zip(symbols, states))

  return enabled
}

export default async ({ fetchTicker, fetchCandles, setEnabledSymbols, startSignallerProcess }: MainInput) => {
  const ticker = await fetchTicker()
  const symbols = getFitTickers(mainCurrency, ticker)
  const candlesRequests = makeCandlesRequests(symbols)
  const candles = await Promise.all(map(fetchCandles, candlesRequests))
  const enabled = analyzer(symbols, candles)

  await Promise.all([
    setEnabledSymbols(enabled),
    ...map(startSignallerProcess, enabled)
  ])
}