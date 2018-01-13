import { __, divide, init, apply, zip, assoc, pair, last, takeLast, nth, useWith, take, splitAt, compose, head, always, contains, filter, map, gt, sortBy, prop, o, reverse, converge, unapply, mean, subtract } from 'ramda'
import debug from 'debug'
import { Stream, observe } from 'most'
import { Requester } from 'cote'
import { williamsr, macd } from 'technicalindicators'
import { ema } from './ema'

const mainSymbols = [ 'BTCUSDT', 'ETHUSDT', 'BNBUSDT' ]

const convSub = converge(subtract, [ nth(1), nth(0) ])
const convPairEmaLast = converge(pair, [ o(ema, init), last ])
const macdHistogram = o(map(prop('histogram')), macd)
const mapClosePrices = map(o(parseFloat, nth(4)))
const assocMacdValues = assoc('values', __, { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 })
const getMacdWeights = map(compose(convSub, convPairEmaLast, takeLast(5), macdHistogram, assocMacdValues, mapClosePrices))
const zipAndSort = unapply(o(sortBy(nth(1)), apply(zip)))

const lowHighMean = converge(unapply(mean), [ o(parseFloat, prop('lowPrice')), o(parseFloat, prop('highPrice')) ])
const meanLastDiff = converge(subtract, [ lowHighMean, o(parseFloat, prop('lastPrice')) ])
const sortByPriceLevel = sortBy(o(parseFloat, converge(gt, [ meanLastDiff, prop('lastPrice') ])))

const sortByChangePerc = o(reverse, sortBy(o(parseFloat, prop('priceChangePercent'))))
const symbolIssetIn = (list: string[]) => converge(contains, [ prop('symbol'), always(list) ])
const symbolToMasterCurrency = compose(head, splitAt(3), <any>prop('symbol'))
const byMasterCurrency = (master: string) => converge(contains, [ always(master), prop('symbol') ])

const fetchJson = (path: string) =>
  fetch(`https://api.binance.com/api/v1${path}`).then((res: Response) => res.json())
const symbolToCandlesPath = (symbol: string) => `/klines?symbol=${symbol}&interval=15m&limit=40`

type Main = (a: (a: Event) => void, b: Stream<{}>, c: any, d: Requester) => void
const main: Main = (exitProcess, mainLoopStream, fetch, requester) => {
  const tick = async () => {
    const tickers = await fetchJson('/ticker/24hr')
    const masterUsdtPair = compose(head, sortByChangePerc, filter(symbolIssetIn(mainSymbols))) (tickers)
    const masterCurrency = symbolToMasterCurrency(masterUsdtPair)
    const slavesTickers = compose(sortByPriceLevel, take(5), sortByChangePerc, filter(byMasterCurrency(masterCurrency)))(tickers)
    const selectedPairs = map(prop('symbol'), slavesTickers)

    const pairsCandles = await Promise.all(map(o(fetchJson, symbolToCandlesPath))(selectedPairs))
    const weights = getMacdWeights(pairsCandles)
    const pairsWeights = zipAndSort(selectedPairs, weights)
    const pairToTrade = o(head, last)(pairsWeights)

    debug('dev')(pairsWeights)
    debug('dev')(pairToTrade)
  }

  observe(tick, mainLoopStream)

  // spawn pm2 process for pair and store pid
  // wait for signalPublishersWorkComplete and pm2.stop them
}

export default main
