import { delay } from 'redux-saga'
import { put } from 'redux-saga/effects'
import { testSaga, expectSaga } from 'redux-saga-test-plan'
import mainLoopSaga, {
  checkBuyConditionSaga,
  checkSellConditionSaga,
  clearPreviousAnalytics
} from '../mainLoop'

import { tooMuchOpenedPositions, noPositionsToCover } from 'shared/actions'
import { selectActivePositions, selectHighestBids } from 'shared/sagas/selectors'
import { analyticSaga, saveAnalyticsSaga } from '../analytic'
import { doSellSaga, doBuySaga } from '../wallet'

const symbol = 'tBTCUSD'

test('mainLoopSaga should work correctly', () => {
  testSaga(mainLoopSaga, symbol)
    .next()
    .call(delay, 2000)
    .next()
    .call(clearPreviousAnalytics, symbol)
    .next()
    .call(saveAnalyticsSaga, symbol)
    .next()
    .select(selectActivePositions, symbol)
    .next([ 1, 2, 3 ])
    .call(analyticSaga, symbol)
    .next({ status: 1 })
    .call(checkBuyConditionSaga, symbol, [ 1, 2, 3 ])
    .next()
    .call(delay, 5000)
    .next()
    .call(saveAnalyticsSaga, symbol)
})

test('checkBuyConditionSaga should call doBuySaga when number of opened positions is lower then five', () => {
  testSaga(checkBuyConditionSaga, symbol, [ 1, 2, 3 ])
    .next()
    .call(doBuySaga, symbol)
    .next()
    .isDone()
})

test('checkBuyConditionSaga should put tooMuchOpenedPositions when number of opened positions is greater then five', () => {
  testSaga(checkBuyConditionSaga, symbol, [ 1, 2, 3, 4, 5 ])
    .next()
    .put(tooMuchOpenedPositions())
    .next()
    .isDone()
})

test('checkSellConditionSaga should call doSellSaga when at least one position can be covered', () => {
  const positions = [ { id: 1, price: 100, amount: 1 }, { id: 2, price: 110, amount: 1 } ]
  testSaga(checkSellConditionSaga, symbol, positions)
    .next()
    .select(selectHighestBids, symbol)
    .next([ [ 100.5, 1, 1 ] ])
    .call(doSellSaga, symbol, { coverId: 1 })
    .next()
    .isDone()
})

test('checkSellConditionSaga should put noPositionsToCover when no one position can\'t be covered', () => {
  const positions = [ { id: 1, price: 100, amount: 1 }, { id: 2, price: 110, amount: 1 } ]
  testSaga(checkSellConditionSaga, symbol, positions)
    .next()
    .select(selectHighestBids, symbol)
    .next([ [ 100.4, 1, 1 ] ])
    .put(noPositionsToCover())
    .next()
    .isDone()
})
