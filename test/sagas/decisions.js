import test from 'ava'
import { testSaga, expectSaga } from 'redux-saga-test-plan'
import { estimateGlobalStatsSaga, estimateLocalStatsSaga, triggerBuy, triggerSell, boostSells } from 'worker/sagas/decisions'
import { selectStopTransactionState, selectStatsDuringTime } from 'worker/sagas/selectors'
import { addStats } from 'shared/actions'
import rootReducer from 'shared/reducers'
import { now } from 'shared/utils'

const MINUTE = 1000 * 60
const THIRTY_MINUTES = MINUTE * 30

test('estimateLocalStatsSaga should call buy when previous buyChange is bigger', () =>
  testSaga(estimateLocalStatsSaga)
    .next()
    .take(addStats)
    .next({ payload: { buyChange: 0.015, lowestAsk: 0.045 } })
    .take(addStats)
    .next({ payload: { buyChange: 0.014, lowestAsk: 0.044 } })
    .select(selectStopTransactionState, 'buy')
    .next(false)
    .select(selectStopTransactionState, 'sell')
    .next(false)
    .fork(triggerBuy)
    .next()
    .take(addStats))

test('estimateLocalStatsSaga should call sell when previous sellChange is smaller', () =>
  testSaga(estimateLocalStatsSaga)
    .next()
    .take(addStats)
    .next({ payload: { sellChange: 0.014, highestBid: 0.044 } })
    .take(addStats)
    .next({ payload: { sellChange: 0.015, highestBid: 0.045 } })
    .select(selectStopTransactionState, 'buy')
    .next(false)
    .select(selectStopTransactionState, 'sell')
    .next(false)
    .fork(triggerSell)
    .next()
    .take(addStats))

test.skip('estimateGlobalStatsSaga should call boostSells when dynamic is down over negative', () =>
  testSaga(estimateGlobalStatsSaga)
    .next()
    .take(addStats)
    .next({})
    .select(selectStatsDuringTime, now() - THIRTY_MINUTES)
    .next([
      { created: now() - (MINUTE * 36), buyChange: 0.016, sellChange: 0.005 },
      { created: now() - (MINUTE * 31), buyChange: 0.014, sellChange: 0.004 },
      { created: now() - (MINUTE * 26), buyChange: 0.004, sellChange: 0.001 },
      { created: now() - (MINUTE * 26), buyChange: 0.003, sellChange: 0.0009 }
    ])
    .take(addStats)
    .next({})
    .select(selectStatsDuringTime, now() - THIRTY_MINUTES)
    .next([
      { created: now() - (MINUTE * 36), buyChange: 0.016, sellChange: 0.005 },
      { created: now() - (MINUTE * 31), buyChange: 0.014, sellChange: 0.004 },
      { created: now() - (MINUTE * 26), buyChange: 0.004, sellChange: 0.001 },
      { created: now() - (MINUTE * 26), buyChange: 0.003, sellChange: 0.0009 },
      { created: now() - (MINUTE * 26), buyChange: -0.1, sellChange: -0.1 },
      { created: now() - (MINUTE * 26), buyChange: 0, sellChange: 0 }
    ])
    .fork(boostSells)
    .next()
    .take(addStats))

test.skip('estimateGlobalStatsSaga should create buy chunks when dynamic is down to negative', () =>
  expectSaga(estimateGlobalStatsSaga)
    .withReducer(rootReducer, {
      stats: [
        { created: now() - (MINUTE * 21), buyChange: 0.014, sellChange: 0.004 },
        { created: now() - (MINUTE * 16), buyChange: 0.004, sellChange: 0.001 },
        { created: now() - (MINUTE * 11), buyChange: 0.003, sellChange: 0.0009 },
        { created: now() - (MINUTE * 5), buyChange: -0.1, sellChange: -0.1 }
      ],
      wallet: [
        [ now(), { BTC: 1, ETH: 2 } ]
      ],
      currentPair: 'BTC_ETH'
    })
    .fork(boostSells)
    .dispatch(addStats({ created: now() - MINUTE, buyChange: -0.1, sellChange: -0.1 }))
    .dispatch(addStats({ created: now(), buyChange: -0.2, sellChange: -0.2 }))
    .run())

test('estimateGlobalStatsSaga should catch peak', () =>
  expectSaga(estimateGlobalStatsSaga)
    .withReducer(rootReducer, {
      stats: [
        { created: now() - (MINUTE * 6), buyChange: 0.014, sellChange: 0.004 },
        { created: now() - (MINUTE * 5), buyChange: 0.015, sellChange: 0.005 },
        { created: now() - (MINUTE * 4), buyChange: 0.016, sellChange: 0.006 },
        { created: now() - (MINUTE * 3), buyChange: 0.017, sellChange: 0.007 },
        { created: now() - (MINUTE * 2), buyChange: 0.018, sellChange: 0.008 }
      ],
      wallet: [
        [ now(), { BTC: 1, ETH: 2 } ]
      ],
      currentPair: 'BTC_ETH'
    })
    .fork(boostSells)
    .dispatch(addStats({ created: now() - MINUTE, buyChange: 0.017, sellChange: 0.007 }))
    .dispatch(addStats({ created: now(), buyChange: 0.016, sellChange: 0.006 }))
    .run())
