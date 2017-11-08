import debug from 'debug'
import { delay, SagaIterator } from 'redux-saga'
import { all, put, call, select, take, fork } from 'redux-saga/effects'
import {
  curry, add, multiply, find, prop, cond, converge, ifElse, length, gt, nth,
  gte, map, compose, applyTo, always, equals, isNil, identity, applySpec
} from 'ramda'

import { clearMACDResults, clearRVIResults, clearStochResults, tooMuchOpenedPositions, noPositionsToCover } from 'shared/actions'
import { selectActivePositions, selectHighestBids } from 'shared/sagas/selectors'

import { analyticSaga, saveAnalyticsSaga } from './analytic'
import { doSellSaga, doBuySaga, getChunkAmount } from './wallet'

const getThreshold = converge(add, [ multiply(0.005), identity ])

const findPositionToCover = curry((bid: number) =>
  find(compose(gte(bid), compose(getThreshold, prop('price')))))

const doNothing = (symbol: string, positions: any[]) => {}

const getSagaByStatus = cond([
  [ equals(0), always(checkSellConditionSaga) ],
  [ equals(1), always(checkBuyConditionSaga) ],
  [ equals(-1), always(checkSellConditionSaga) ]
])

export function* checkBuyConditionSaga(symbol: string, positions: any[]) {
  yield ifElse(
    compose(gt(10), length),
    always(call(doBuySaga, symbol)),
    always(put(tooMuchOpenedPositions()))
  )(positions)
}

export function* checkSellConditionSaga(symbol: string, positions: any[]) {
  const [ bid ] = yield select(selectHighestBids, symbol)
  const posToCover = findPositionToCover(nth(0, bid))(positions)

  yield ifElse(
    isNil,
    always(put(noPositionsToCover())),
    always(call(doSellSaga, symbol, posToCover))
  )(posToCover)
}

export function* logNoPositionsToCover() {
  while (true) {
    yield take(noPositionsToCover)
    debug('worker')('No opened positions to cover')
  }
}

export function* clearPreviousAnalytics(symbol: string) {
  yield all(
    map(compose((action: Action) => put(action), applyTo({ symbol })))
      ([ clearMACDResults, clearRVIResults, clearStochResults ]))
}

export default function* mainLoopSaga(symbol: string) {
  yield fork(logNoPositionsToCover)
  yield call(delay, 2000)
  yield call(clearPreviousAnalytics, symbol)
  const chunkAmount = yield call(getChunkAmount, symbol)
  debug('worker')({ chunkAmount })

  while (true) {
    yield call(saveAnalyticsSaga, symbol)
    const positions = yield select(selectActivePositions, symbol)
    const { status } = yield call(analyticSaga, symbol)
    yield fork(getSagaByStatus(status), symbol, positions)
    yield call(delay, 10000)
  }
}
