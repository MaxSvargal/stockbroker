import { take, select, fork, put } from 'redux-saga/effects'
import { setCurrency, addStats } from 'actions'
import { selectSellsLastTime, selectBuysLastTime, selectCurrencyPair } from 'sagas/selectors'
import { CURRENT_PAIR, TEN_MINUTES } from 'const'

// пересчитывать статистику при изменении курса на большой процент (1% пример)
// в зависимости от разрядности курса (> 100 === 0.1%)

const getRate = i => i[1]
const getAmount = i => i[2]
const getSummNumber = (a, b) => Number(a) + Number(b)
// TODO: rewrite this shit
const getRateChange = arr => arr
  .reduce((prev, curr) =>
    ([ curr, [ ...prev[1], (curr - prev[0]) / curr ] ]),
    [ arr[0], [] ])[1]
  .reduce((prev, curr, index) =>
    (index === arr.length - 1 ? prev / arr.length : prev + curr), 0)

export function* generateStatsSaga() {
  const sells = yield select(selectSellsLastTime, TEN_MINUTES)
  const buys = yield select(selectBuysLastTime, TEN_MINUTES)
  const { last } = yield select(selectCurrencyPair)

  const buyVolume = buys.map(getAmount).reduce(getSummNumber, 0)
  const sellVolume = sells.map(getAmount).reduce(getSummNumber, 0)
  const buyChange = getRateChange(buys.map(getRate))
  const sellChange = getRateChange(sells.map(getRate))

  yield put(addStats([ Number(last), buyVolume, sellVolume, buyChange, sellChange ]))
}

export default function* StatsSaga() {
  while (true) {
    const action = yield take(setCurrency)
    if (action.payload[0] === CURRENT_PAIR) yield fork(generateStatsSaga)
  }
}
