import { take, select, call, put } from 'redux-saga/effects'
import { setCurrency, setTrends } from 'actions'
import { selectCurrencyPair, selectAsk, selectBid, selectSells } from 'sagas/selectors'
import { CURRENT_PAIR } from 'const'

// забрать за последние 10 минут статистику и показать направление
const getTrend = data => data
  .map(item => Number(item[0]))
  .reduce((prev, curr) => (prev[0] < curr ? [ curr, prev[1] + 1 ] : [ curr, prev[1] - 1 ]), [ 0, 0 ])

function* calculateUsdtDash() {
  const currencyProps = yield select(selectCurrencyPair, CURRENT_PAIR)
  const asks = yield select(selectAsk)
  const bids = yield select(selectBid)
  const sells = yield select(selectSells)

  const asksTrend = getTrend(asks)
  const bidsTrend = getTrend(bids)

  yield put(setTrends({ ask: true, bind: true }))
  // значения ниже - спад, выше - подъём
  // lowestAsk или highestBid - текущий курс
  // console.log(currencyProps)
  // console.log('Тренд цены на покупку', asksTrend)
  // console.log('Тренд цены на продажу', bidsTrend)
  // console.log('Последнее предложение покупки', asks[asks.length - 1])
  // console.log('Последнее предложение продажи', bids[bids.length - 1])
  // console.log('Последний факт покупки', sells[sells.length - 1])
  // console.log('-------------------------------')
}

export default function* TradeSaga() {
  while (true) {
    const action = yield take(setCurrency)
    if (action.payload[0] === CURRENT_PAIR) yield call(calculateUsdtDash)
  }
}
