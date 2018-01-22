import { __, equals, append, unnest, unary, flip, invoker, divide, init, apply,
  zip, assoc, pair, last, takeLast, nth, useWith, take, splitAt, compose, head,
  always, contains, filter, map, gt, sortBy, prop, o, reverse, converge, mean,
  unapply, subtract, match, uniq, reject, isNil, length
} from 'ramda'

import {
  processStartSignalerRequest, processStartListenerRequest, getCurrentSymbolRequest,
  setCurrentSymbolRequest, setSymbolWeights, setExchangeInfoRequest
} from './requests'

import * as pm2 from 'pm2'
import { Stream, observe } from 'most'
import { Requester, Publisher } from 'cote'
import { macd } from 'technicalindicators'
import { ema } from './ema'
import { log, error } from '../utils/log'

const mainSymbols = [ 'BTCUSDT' /*, 'ETHUSDT', 'BNBUSDT' */ ]

const invokeSend = flip(invoker(1, 'send'))
const invokePublish = invoker(2, 'publish')
const makePublichExitFromSymbols = flip(invokePublish('exitFromSymbols'))
const stringify = flip(invoker(1, 'stringify'))(JSON)

const convSub = converge(subtract, [ nth(1), nth(0) ])
const convPairEmaLast = converge(pair, [ o(ema, init), last ])
const macdHistogram = o(map(prop('histogram')), macd)
const mapClosePrices = map(o(parseFloat, nth(4)))
const assocMacdValues = assoc('values', __, { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 })
const getMacdWeights = map(compose(convSub, convPairEmaLast, takeLast(5), macdHistogram, assocMacdValues, mapClosePrices))
const zipAndSort = unapply(o(sortBy(nth(1)), apply(zip)))
const topWeightLessZero = compose(gt(0), last, last)

const lowHighMean = converge(unapply(mean), [ o(parseFloat, prop('lowPrice')), o(parseFloat, prop('highPrice')) ])
const meanLastDiff = converge(subtract, [ lowHighMean, o(parseFloat, prop('lastPrice')) ])
const sortByPriceLevel = sortBy(o(parseFloat, converge(gt, [ meanLastDiff, prop('lastPrice') ])))

const sortByChangePerc = o(reverse, sortBy(o(parseFloat, prop('priceChangePercent'))))
const symbolIssetIn = (list: string[]) => converge(contains, [ prop('symbol'), always(list) ])
const byMasterCurrency = (master: string) => converge(contains, [ always(master), prop('symbol') ])
const formatSymbolsToStore = compose(unnest, map(converge(pair, [ prop('symbol'), unary(stringify) ])), prop('symbols'))

const getTheBestMasterTicker = compose(head, sortByPriceLevel, sortByChangePerc, filter(symbolIssetIn(mainSymbols)))
const takeCurrencyFromTicker = compose(converge(pair, [ nth(1), nth(2) ]), match(/(...)(.+)/), prop('symbol'))
const getNegativeWeightSymbols = o(map(head), filter(o(gt(0), last)))

const symbolToCandlesPath = (symbol: string) => `/klines?symbol=${symbol}&interval=15m&limit=40`

type Main = (a: (a: Event) => void, b: Stream<{}>, c: any, d: Requester, e: Requester, f: Requester, g: Publisher) => void
const main: Main = (exitProcess, mainLoopStream, fetch, requesterPersistStore, requesterRespondStore, requesterProcess, publisher) => {
  const storePersist: (req: {}) => any = invokeSend(requesterPersistStore)
  const storeRequest: (req: {}) => any = invokeSend(requesterRespondStore)
  const publishExitFromSymbols = makePublichExitFromSymbols(publisher)
  const processes = invokeSend(requesterProcess)
  const fetchJson = (path: string): Promise<any> =>
    fetch(`https://api.binance.com/api/v1${path}`).then((res: Response) => res.json())

  const exchangeInfo = fetchJson('/exchangeInfo')
    .then(o(storePersist, o(setExchangeInfoRequest, formatSymbolsToStore)))
    .catch(exitProcess)

  const tick = async () => {
    try {
      log('Tick started')
      const [ tickers, currentSymbol ] = await Promise.all([
        fetchJson('/ticker/24hr'),
        storeRequest(getCurrentSymbolRequest())
      ])
      log('Tickers fetched')
      const bestMasterTicker = getTheBestMasterTicker(tickers)
      const [ masterCurrency ] = takeCurrencyFromTicker(bestMasterTicker)
      const slavesTickers: {}[] = compose(sortByPriceLevel, take(5), sortByChangePerc, filter(byMasterCurrency(masterCurrency)))(tickers)
      const selectedPairs: string[] = compose(<any>uniq, reject(isNil), <any>append(currentSymbol), map(<any>prop('symbol')))(slavesTickers)
      const pairsCandles = await Promise.all(map(o(fetchJson, symbolToCandlesPath))(selectedPairs))
      log('Candles fetched')

      const weights = getMacdWeights(pairsCandles)
      const pairsWeights = zipAndSort(selectedPairs, weights)
      const negativeWeightSymbols = getNegativeWeightSymbols(pairsWeights)
      const symbolToTrade = o(head, last)(pairsWeights)
      log(pairsWeights)

      if (length(negativeWeightSymbols)) publishExitFromSymbols(negativeWeightSymbols)

      await storePersist(setSymbolWeights(<any>stringify(weights)))
      // if current trade pair has minus, when send signal to sell all opened positions
      if (topWeightLessZero(pairsWeights)) return error('All symbols are down. Try on next tick...')

      log(`Symbol selected: ${symbolToTrade}`)
      if (equals(symbolToTrade, currentSymbol)) {
        log(`Symbol ${symbolToTrade} is active already`)
      } else {
        log(`Switch to symbol ${symbolToTrade}`)
        await Promise.all([
          storePersist(setCurrentSymbolRequest(symbolToTrade)), // TODO: check it?
          processes(processStartSignalerRequest(symbolToTrade)),
          processes(processStartListenerRequest(symbolToTrade))
        ])
      }

      log('Tick complete')
    } catch (err) {
      exitProcess(err)
    }
  }

  observe(tick, mainLoopStream)
}

export default main
