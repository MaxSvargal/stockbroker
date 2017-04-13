import { fork, take, put, select } from 'redux-saga/effects'
import { addStats, addChunks, requestNewChunks, removeChunk, botMessage } from 'shared/actions'
import { selectObsoleteTransactions, selectCurrencyProps, selectLastTenStats } from 'server/sagas/selectors'

export function* watchForNewChunks() {
  while (true) {
    const { payload } = yield take(requestNewChunks)
    // const [ , currency ] = yield select(selectCurrencyPairSplited)

    yield put(addChunks(payload))
    // yield put(botMessage(`Созданы ${type === 'buy' ? 'покупки' : 'продажи'} за ${rate} в количестве ${num} частей по ${amount} ${currency}`))
  }
}

export function* clearObsoleteChunks() {
  while (true) {
    yield take(addStats)
    const lastTenStats = yield select(selectLastTenStats)

    const isStagnate = lastTenStats.slice(lastTenStats.length - 5, lastTenStats.length)
      .map(stat => stat[3] - stat[4])
      .map(value => value.toFixed(5))
      .reduce((prev, curr) => prev === curr && curr)

    if (isStagnate === true) {
      const { last } = yield select(selectCurrencyProps)
      const obsoleteTransactions = yield select(selectObsoleteTransactions, last)
      yield obsoleteTransactions.map(id => put(removeChunk(id)))
      yield put(botMessage(`Чанки в количестве ${obsoleteTransactions.length} шт. инвалидированы`))
    }
  }
}

export default function* chunksSaga() {
  yield [
    fork(watchForNewChunks),
    fork(clearObsoleteChunks)
  ]
}
