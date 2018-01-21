import { __, equals, append, unnest, unary, flip, invoker, divide, init, apply,
  zip, assoc, pair, last, takeLast, nth, useWith, take, splitAt, compose, head,
  always, contains, filter, map, gt, sortBy, prop, o, reverse, converge, mean,
  unapply, subtract
} from 'ramda'
import debug from 'debug'
import { Stream, observe } from 'most'
import { Requester, Publisher } from 'cote'
import { macd } from 'technicalindicators'
import { ema } from './ema'
import * as pm2 from 'pm2'

const mainSymbols = [ 'BTCUSDT' /*, 'ETHUSDT', 'BNBUSDT'*/ ]

const processStartSignalerRequest = (symbol: string) => ({
  type: 'processStart',
  options: {
    name: `Signal Publisher ${symbol}`,
    script: `./services/signal-publisher/index.ts`,
    env: { SYMBOL: symbol }
  }
})
const processStartListenerRequest = (symbol: string) => ({
  type: 'processStart',
  options: {
    name: `Binance Exchange Listener ${symbol}`,
    script: `./services/binance-listener/index.ts`,
    env: { SYMBOL: symbol }
  }
})
const setCurrentSymbolRequest = (value: string) => ({
  type: 'cacheHashSet', key: 'tradeState', field: 'currentSymbol', value
})
const getCurrentSymbolRequest = () => ({
  type: 'cacheHashGet', key: 'tradeState', field: 'currentSymbol'
})

const formatSymbolsToStore = compose(unnest, map(converge(pair, [ prop('symbol'), unary(JSON.stringify) ])), prop('symbols'))
const setExchangeInfoRequest = (data: any) => ({
  type: 'cacheHashMultiSet',
  key: 'exchangeInfoSymbols',
  values: formatSymbolsToStore(data)
})

const invokeSend = flip(invoker(1, 'send'))
const invokePublish = invoker(2, 'publish')

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
const symbolToMasterCurrency = compose(head, splitAt(3), <any>prop('symbol'))
const byMasterCurrency = (master: string) => converge(contains, [ always(master), prop('symbol') ])

const symbolToCandlesPath = (symbol: string) => `/klines?symbol=${symbol}&interval=15m&limit=40`

type Main = (a: (a: Event) => void, b: Stream<{}>, c: any, d: Requester, e: Requester, f: Requester) => void
const main: Main = (exitProcess, mainLoopStream, fetch, requesterPersistStore, requesterRespondStore, requesterProcess) => {
  const storePersist: (req: {}) => any = invokeSend(requesterPersistStore)
  const storeRequest: (req: {}) => any = invokeSend(requesterRespondStore)
  const processes = invokeSend(requesterProcess)
  const fetchJson = (path: string) =>
    fetch(`https://api.binance.com/api/v1${path}`).then((res: Response) => res.json())

  const exchangeInfo = fetchJson('/exchangeInfo')
    .then(o(storePersist, setExchangeInfoRequest))
    .catch(exitProcess)

  const tick = async () => {
    try {
      debug('dev')('Tick started')
      const tickers = await fetchJson('/ticker/24hr')
      debug('dev')('Tickers fetched')
      const masterUsdtPair = compose(head, sortByPriceLevel, sortByChangePerc, filter(symbolIssetIn(mainSymbols)))(tickers)
      // TODO: fix this, some currecties has 4 chars
      const masterCurrency = symbolToMasterCurrency(masterUsdtPair)
      const slavesTickers = compose(sortByPriceLevel, take(5), sortByChangePerc, filter(byMasterCurrency(masterCurrency)))(tickers)
      const selectedPairs = map(<any>prop('symbol'), slavesTickers)

      const pairsCandles = await Promise.all(map(o(fetchJson, symbolToCandlesPath))(selectedPairs))
      debug('dev')('Candles fetched')
      const weights = getMacdWeights(pairsCandles)
      const pairsWeights = zipAndSort(selectedPairs, weights)
      const symbolToTrade = o(head, last)(pairsWeights)

      debug('dev')(pairsWeights)
      debug('dev')(`Symbol selected: ${symbolToTrade}`)
      // if current trade pair has minus, when send signal to sell all opened positions
      if (topWeightLessZero(pairsWeights)) debug('dev')('All symbols are down. Try on next tick...')

      const currentSymbol = await storeRequest(getCurrentSymbolRequest())

      if (equals(symbolToTrade, currentSymbol)) {
        debug('dev')(`Symbol ${symbolToTrade} is active already`)
      } else {
        debug('dev')(`Switch to symbol ${symbolToTrade}`)
        await Promise.all([
          storePersist(setCurrentSymbolRequest(symbolToTrade)), // TODO: check it?
          processes(processStartSignalerRequest(symbolToTrade)),
          processes(processStartListenerRequest(symbolToTrade))
        ])
      }

      debug('dev')('Complete')
    } catch (err) {
      exitProcess(err)
    }
  }

  observe(tick, mainLoopStream)
}

export default main
