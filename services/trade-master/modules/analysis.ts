import {
  unapply, converge, filter, o, contains, head, always, prop, last, reverse, pair, lt, equals, unnest,
  sortBy, take, compose, map, merge, identity, objOf, nth, assoc, mergeAll, allPass, both, zip
} from 'ramda'
import { williamsr, bollingerbands, ema } from 'technicalindicators'
import { log } from '../../utils/log'

const mainCurrency = 'ETH'
const symbolsNumForAnalysis = 20
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
const calcBB = compose(bollingerbands, assocPeriod(20), assocStdDev(2), objValues)
const calcEMA = compose(last, ema, assocPeriod(7), objOf('values'))
const getEmaPair = converge(pair, [ calcEMA, last ])
const isBBPositive = allPass([ converge(lt, [ head, last ]), o(lt(0.5), head) ])
const isWRPositive = converge(lt, [ head, last ])
const indicatorsArePositive = compose(map(both(o(isWRPositive, head), o(isBBPositive, last))), zip)
const getTruthSymbols = o(map(head), filter(o(equals(true), last)))

export default async ({ fetchTicker, fetchCandles, setEnabledSymbols, startSignallerProcess }: MainInput) => {
  const ticker = await fetchTicker()
  const symbols = getFitTickers(mainCurrency, ticker)
  const candlesRequests = makeCandlesRequests(symbols)
  
  const candles = await Promise.all(map(fetchCandles, candlesRequests))

  const wrs = map(o(getEmaPair, calcWR), candles)
  const bbs = map(compose(getEmaPair, map(prop('pb')), calcBB), candles)
  const states = zip(symbols, indicatorsArePositive(wrs, bbs))
  const enabled = getTruthSymbols(states)
  
  await Promise.all([
    setEnabledSymbols(enabled),
    ...map(startSignallerProcess, enabled)
  ])
  
  log(compose(map(unnest), zip(states), zip(bbs))(wrs))
}