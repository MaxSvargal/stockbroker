import { all, fork, take, put, select } from 'redux-saga/effects'
import { addMessage, addChunks, requestNewChunks, removeChunk, requestInvalidateChunks } from '../../shared/actions'
import { selectObsoleteTransactions, selectCurrencyProps } from '../sagas/selectors'

export function* watchForNewChunksSaga() {
  while (true) {
    const { payload } = yield take(requestNewChunks)
    const { type, num, rate, amount } = payload

    yield put(addChunks(payload))
    yield put(addMessage('chunks', { action: 'created', type, rate, amount, num }))
  }
}

export function* clearObsoleteChunksSaga() {
  while (true) {
    yield take(requestInvalidateChunks)
    const { last } = yield select(selectCurrencyProps)
    const obsoleteTransactions = yield select(selectObsoleteTransactions, last)
    yield obsoleteTransactions.map(id => put(removeChunk(id)))
    yield put(addMessage('chunks', { action: 'invalidated', num: obsoleteTransactions.length }))
  }
}

export default function* chunksSaga() {
  yield all([
    fork(watchForNewChunksSaga),
    fork(clearObsoleteChunksSaga)
  ])
}
