import { testSaga } from 'redux-saga-test-plan'
import { requestExecPosition } from 'shared/actions'
import { selectActivePositions } from 'shared/sagas/selectors'
import { watchRequestPosition, execPositionBuy, execPositionSell, getChunkAmount } from '../positions'

test('watchRequestBuy should work correctly', () => {
  testSaga(watchRequestPosition)
    .next()
    .take(requestExecPosition)
    .next({ payload: { symbol: 'tBTCUSD', exec: 1 } })
    .fork(execPositionBuy, 'tBTCUSD')
    .next()
    .take(requestExecPosition)
    .next({ payload: { symbol: 'tBTCUSD', exec: -1 } })
    .fork(execPositionSell, 'tBTCUSD')
    .next()
    .take(requestExecPosition)
})

test('execPositionBuy should work correctly', () => {
  testSaga(execPositionBuy, 'tBTCUSD')
    .next()
    .select(selectActivePositions)
    .next([ { id: 0, symbol: 'tBTCUSD' } ])
    .call(getChunkAmount, 'tBTCUSD')
    .next(0.01)
})
