import { expectSaga, testSaga } from 'redux-saga-test-plan'
import { selectAmountToBuy, selectAmountToSell, selectTickerBySymbol } from 'shared/sagas/selectors'
import { getChunkAmountForStochastic } from '../wallet'

test('getChunkAmountForStochastic should return chunks amount', () => {
  // TODO: Check avaliable amount to sell and buy separately?
  expect(getChunkAmountForStochastic(0.18, 0)).toEqual(0.027)
  expect(getChunkAmountForStochastic(0.18, 40)).toEqual(0.0126)

  expect(getChunkAmountForStochastic(0.18, 60)).toEqual(0.0126)
  expect(getChunkAmountForStochastic(0.18, 100)).toEqual(0.027)

  expect(getChunkAmountForStochastic(0.1, 90)).toEqual(0.013)
  expect(getChunkAmountForStochastic(0.1, 81)).toEqual(0.0112)

  expect(getChunkAmountForStochastic(0.1, 22)).toEqual(0.0106)
  expect(getChunkAmountForStochastic(0.1, 36)).toEqual(0.0078)

  expect(getChunkAmountForStochastic(0.071, 40)).toEqual(0.005)
  expect(getChunkAmountForStochastic(0.0333, 0)).toEqual(0.005)
  expect(getChunkAmountForStochastic(0.071, 60)).toEqual(0.005)
  expect(getChunkAmountForStochastic(0.0333, 100)).toEqual(0.005)

  /* My current volume */
  expect(getChunkAmountForStochastic(0.0517, 27)).toEqual(0.005)
  expect(getChunkAmountForStochastic(0.0517, 73)).toEqual(0.005)
})
