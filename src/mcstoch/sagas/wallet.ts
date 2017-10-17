import { select } from 'redux-saga/effects'
import { selectAmountToSell, selectAmountToBuy, selectCurrentPrice } from 'shared/sagas/selectors'

export function getChunkAmountForStochastic(fullAmount: number, stochastic: number) {
  const stochPerc = stochastic / 100
  const stochKVal = stochPerc > 0.5 ? stochPerc : 1 - stochPerc
  const numOfChunks = 10
  const multiplier = 4
  const stabilizer = 1

  const chunkAmount = (fullAmount / (numOfChunks * 2)) * ((stochKVal * multiplier) - stabilizer)
  return Math.round(chunkAmount * 1e4) / 1e4
}

export default function* getChunkAmount(symbol: string, stoch: number) {
  const amountToSell = yield select(selectAmountToSell, symbol)
  const amountToBuy = yield select(selectAmountToBuy, symbol)
  const currentPrice = yield select(selectCurrentPrice, symbol)
  const fullAmount = amountToSell + (amountToBuy / currentPrice)

  return getChunkAmountForStochastic(fullAmount, stoch)
}
