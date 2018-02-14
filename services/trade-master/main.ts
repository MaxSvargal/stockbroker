import { __, equals, append, unnest, unary, flip, invoker, divide, init, apply,
  zip, assoc, pair, last, takeLast, nth, useWith, take, splitAt, compose, head,
  always, contains, filter, map, gt, lt, sortBy, prop, o, reverse, converge, of,
  unapply, subtract, match, uniq, reject, isNil, length, mergeAll, objOf, sort,
  find, curry, mergeWith, reduce, concat, both, keys, mean, applyTo, union,
  negate, toPairs, allPass, juxt, flatten
} from 'ramda'

import {
  processStartSignallerRequest, setEnabledSymbolsRequest, setExchangeInfoRequest
} from './requests'

import * as pm2 from 'pm2'
import { Stream, observe } from 'most'
import { Requester, Publisher } from 'cote'
import { williamsr, ema, obv } from 'technicalindicators'
// import { ema } from './ema'
import { log, error } from '../utils/log'

const mainSymbols = [ /* 'BTCUSDT', */ 'ETHUSDT' /* , 'BNBUSDT' */ ]

const invokeSend = flip(invoker(1, 'send'))
const invokePublish = invoker(2, 'publish')
const collectRequests = map(processStartSignallerRequest)

const objHigh = o(objOf('high'), map(nth(2)))
const objLow = o(objOf('low'), map(nth(3)))
const objClose = o(objOf('close'), map(o(parseFloat, nth(4))))
const objVolume = o(objOf('volume'), map(o(parseInt, nth(5))))
const assocPeriod = assoc('period')
const prepareCandlesToWR = converge(unapply(mergeAll), [ objLow, objClose, objHigh ])
const prepareCandlesToOBV = converge(unapply(mergeAll), [ objClose, objVolume ])
const calcWR = compose(williamsr, assocPeriod(14), prepareCandlesToWR)
const calcEMA = compose(last, ema, assocPeriod(7), objOf('values'))
const calcOBV = compose(obv, prepareCandlesToOBV)
const getWR = compose(converge(pair, [ o(Math.round, calcEMA), o(Math.round, last) ]), calcWR)
const getOBV = compose(converge(pair, [ o(Math.round, calcEMA), last ]), calcOBV)
const obvIsGrow = converge(lt, [ head, last ])
const obvIsDrop = converge(gt, [ head, last ])
const wrIsGrow = allPass([ converge(lt, [ head, last ]), o(lt(-80), last), o(gt(-20), head) ])
const wrIsDrop = allPass([ converge(gt, [ head, last ]), o(lt(-20), head), o(gt(-20), last) ])
const getEnabledToBuy = o(map(head), filter(both(compose(obvIsGrow, last, last), compose(wrIsGrow, head, last))))
const getExitFrom = o(map(head), filter(both(compose(obvIsDrop, last, last), compose(wrIsDrop, head, last))))

const lowHighMean = converge(unapply(mean), [ o(parseFloat, prop('lowPrice')), o(parseFloat, prop('highPrice')) ])
const meanLastDiff = converge(subtract, [ lowHighMean, o(parseFloat, prop('lastPrice')) ])
const sortByPriceLevel = sortBy(o(parseFloat, converge(gt, [ meanLastDiff, prop('lastPrice') ])))

const sortByChangePerc = o(reverse, sortBy(o(parseFloat, prop('priceChangePercent'))))
const symbolIssetIn = (list: string[]) => converge(contains, [ prop('symbol'), always(list) ])
const byMasterCurrency = (master: string) => converge(contains, [ always(master), prop('symbol') ])

const getTheBestMasterTicker = compose(head, sortByPriceLevel, sortByChangePerc, filter(symbolIssetIn(mainSymbols)))
const takeCurrencyFromTicker = compose(converge(pair, [ nth(1), nth(2) ]), match(/(...)(.+)/), prop('symbol'))

const replaceInfoSymbols = (data: {}[]) => ({ type: 'dbReplaceAll', table: 'exchangeInfoSymbols', primaryKey: 'symbol', data })
const updateSymbolsEnabled = (values: string[]) => ({ type: 'dbUpdate', table: 'tradeState', id: 'symbolsEnabled', data: { values } })
const symbolToCandlesPath = (symbol: string) => `/klines?symbol=${symbol}&interval=1h&limit=28`

type Main = (a: (a: Event) => void, b: Stream<{}>, c: any, d: Requester, e: Requester, f: Publisher) => void
const main: Main = (exitProcess, mainLoopStream, fetch, requesterProcess, requesterDb, publisher) => {
  const processes = invokeSend(requesterProcess)
  const db = invokeSend(requesterDb)
  const fetchJson = (path: string): Promise<any> =>
    fetch(`https://api.binance.com/api/v1${path}`).then((res: Response) => res.json())

  const exchangeInfo = fetchJson('/exchangeInfo')
    .then(compose(db, replaceInfoSymbols, prop('symbols')))
    .catch(exitProcess)

  const tick = async () => {
    try {
      log('Tick started')
      const tickers = await fetchJson('/ticker/24hr')
      log('Tickers fetched')
      const bestMasterTicker = getTheBestMasterTicker(tickers)
      const [ masterCurrency ] = takeCurrencyFromTicker(bestMasterTicker)
      const slavesTickers: {}[] = compose(take(10), sortByChangePerc, filter(byMasterCurrency(masterCurrency)))(tickers)
      const selectedPairs: string[] = compose(<any>uniq, reject(isNil), map(<any>prop('symbol')))(slavesTickers)
      const pairsCandles = await Promise.all(map(o(fetchJson, symbolToCandlesPath))(selectedPairs))
      log('Candles fetched')

      const wrPairs = map(getWR, pairsCandles)
      const obvPairs = map(getOBV, pairsCandles)
      const pairsStats = zip(selectedPairs, zip(wrPairs, obvPairs))
      const enabledSymbols = getEnabledToBuy(pairsStats)
      const toExitSymbols = getExitFrom(pairsStats)

      log(new Date().toLocaleTimeString())
      map(o(log, (v: any) => `${head(v)}    WR: ${o(head, last)(v)}   OBV: ${o(last, last)(v)}`))(pairsStats)
      log('Enabled: ', enabledSymbols)
      log('To exit: ', toExitSymbols)

      await db(updateSymbolsEnabled(enabledSymbols))
      await Promise.all(map(processes, collectRequests(enabledSymbols)))

      log('Tick complete')
    } catch (err) {
      exitProcess(err)
    }
  }

  observe(tick, mainLoopStream)
}

export default main
