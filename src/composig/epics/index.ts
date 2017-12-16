import { Chain, pipe, takeLast, applyTo, values, o, compose, always, nth, tail, head, prop, curry, map, chain, converge, identity } from 'ramda'
import { Observable } from 'rxjs'
import { timeInterval, switchMap, zip, flatMap, combineLatest, mapTo } from 'rxjs/operators'
import { addMACDResult, addRSIResult } from 'shared/actions'
import { CandleData } from 'shared/types'

// TODO Move utils to shared
import { createEpicWithState } from 'wally/epics/utils'
import { FromStore } from 'wally/epics/positions'

import macdHistogram from 'shared/lib/macdHistogram'
import rsi from 'shared/lib/rsi'

type MonadNumberArray = () => number[]

const { concat, of } = Observable
const selectCandles = (pair: string) => prop(`${pair}__candles`)

const macd = curry((pair: string, candles: {}) => {
  const macdFastPeriod = 12
  const macdLongPeriod = 26
  const last = takeLast(macdLongPeriod)
  const getCandlesByTime = curry((pair: string, time: string) =>
    prop(`trade:${time}:t${pair}`))

  const byTime = getCandlesByTime(pair)
  const byM1 = byTime('1m')
  const byM30 = byTime('30m')
  const closePrices = map(nth(2))
  const lastClosePricesM1 = compose(closePrices, last, values, byM1)
  const lastClosePricesM30 = compose(closePrices, last, values, byM30)

  const shortMACD = macdHistogram(<number[]>lastClosePricesM1(candles), macdFastPeriod, macdLongPeriod)
  const longMACD = macdHistogram(<number[]>lastClosePricesM30(candles), macdFastPeriod, macdLongPeriod)

  return [ shortMACD, longMACD ]
})

const compResultActions = curry((candles: {} , pair: any) => {
  console.log('WAT')
  const [ shortMACD, longMACD ] = macd(pair)(candles)
  return Observable.of(
    addMACDResult({ pair, interval: '1m', time: Date.now(), value: shortMACD }),
    addMACDResult({ pair, interval: '30m', time: Date.now(), value: longMACD })
  )
})

const rootEpic = (pair: string) =>
  createEpicWithState((fromStore: FromStore) =>
    switchMap(() => Observable.interval(1000).flatMap(() => <Observable<Action>>chain(
      compResultActions,
      <MonadNumberArray>compose(fromStore, selectCandles)
    )(pair)))
  )

export default rootEpic
