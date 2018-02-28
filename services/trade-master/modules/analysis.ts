import {
  unapply, converge, filter, o, contains, head, always, prop, last, reverse, pair, lt, equals, unnest,
  sortBy, take, compose, map, merge, identity, objOf, nth, assoc, mergeAll, allPass, zip, of, flatten, gt,
  difference, apply, without
} from 'ramda'
import { williamsr, bollingerbands, obv, ema } from 'technicalindicators'
import { log } from '../../utils/log'

const mainCurrency = 'ETH'
const symbolsNumForAnalysis = 20
const limit = 28
const interval = '30m'

let prevEnabled = []

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
const objVolume = o(objOf('volume'), map(o(parseInt, nth(5))))
const assocPeriod = assoc('period')
const assocStdDev = assoc('stdDev')
const prepareCandlesToWR = converge(unapply(mergeAll), [ objLow, objClose, objHigh ])
const prepareCandlesToOBV = converge(unapply(mergeAll), [ objClose, objVolume ])
const calcOBV = compose(obv, prepareCandlesToOBV)
const calcWR = compose(williamsr, assocPeriod(14), prepareCandlesToWR)
const calcBB = compose(bollingerbands, assocPeriod(21), assocStdDev(2), objValues)
const calcEMA = compose(last, ema, assocPeriod(7), objOf('values'))
const getEmaPair = converge(pair, [ calcEMA, last ])
const isBBPositive = allPass([ converge(lt, [ head, last ]), o(lt(0.4), head), o(gt(1.1), last) ])
const isWRPositive = converge(lt, [ head, last ])
const isOBVPositive = converge(lt, [ head, last ])
const indicatorsArePositive = map(allPass([ o(isWRPositive, nth(1)), o(isBBPositive, nth(2)) ]))
const getTruthSymbols = o(map(head), filter(o(equals(true), last)))
const zip4 = o(map(unnest), converge(zip, [ converge(zip, [ nth(0), nth(1) ]), converge(zip, [ nth(2), nth(3) ]) ]))
const issetDiff = <(xs: [ any[], any[] ]) => any[]>converge(difference, [ last, apply(without) ])

export const analyzer = (symbols: string[], candles: number[][]): string[] => {
  const obvs = map(o(getEmaPair, calcOBV), candles) // remove this, don't need
  const wrs = map(o(getEmaPair, calcWR), candles)
  const bbs = map(compose(getEmaPair, map(<any>prop('pb')), calcBB), candles)
  const compiling = zip4([ symbols, wrs, bbs, obvs ])
  const states: boolean[] = indicatorsArePositive(compiling)
  const enabled: string[] = getTruthSymbols(zip(symbols, states))

  log(map(flatten)(zip(states, compiling)))

  // TODO: test mode
  const doubleEnabled: string[] = issetDiff([ prevEnabled, enabled ])
  console.log({ enabled, doubleEnabled })
  prevEnabled = enabled

  return doubleEnabled
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