import { randomInt } from 'shared/lib/random'

export function* requestTradeSequenceSaga() {
  while (true) {
    const { payload: { symbol, type } } = yield take(requestOrdersSequence)

    const amountToBuy = yield select(selectAmountToBuy, symbol)
    const amountToSell = yield select(selectAmountToSell, symbol)
    const [ bid, , ask ] = yield select(selectTickerBySymbol, symbol)

    const amountToBuyInCurrency = amountToBuy / bid
    const ratio = type === 'buy' ? amountToBuyInCurrency / amountToSell : amountToSell / amountToBuyInCurrency
    const [ , toBuyCurr, toSellCurr ] = symbolToPairArr(symbol)
    const minimumAmount = toBuyCurr === 'BTC' ? 0.005 : 0.1
    const numOfChunks = Math.trunc(ratio) + 1
    const amountAvaliablePerChunk = (type === 'buy' ? amountToBuyInCurrency : amountToSell) / 2 / numOfChunks
    const amount = amountAvaliablePerChunk > minimumAmount ? amountAvaliablePerChunk : minimumAmount

    yield fork(treadeSequenceSaga, symbol, amount, numOfChunks)
  }
}

export function* callNewPassiveOrder() {
  // check stop limit?
  // gid?
  const cid = randomInt()
  yield put(requestNewPassiveOrder({ cid, symbol, amount }))
  return cid
}

export function* treadeSequenceSaga(symbol: string, amount: number, numOfChunks: number) {
  let executedChunks = 0

  while (yield select(selectTradePosition, amount > 0)) {
    if (executedChunks === numOfChunks) return true

    const cid = yield call(callNewPassiveOrder)
    const executedOrder = yield take(passiveOrderExecuted)
    if (executedOrder.cid === cid) {
      yield call(callNewPassiveOrder)
      ++executedChunks
    }
    else {
      // wat? does not work
      yield take(passiveOrderExecuted)
    }
  }
}
