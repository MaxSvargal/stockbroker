import debug from 'debug'
import { call, fork, select, take, put } from 'redux-saga/effects'
import { OrderData, RequestExecPositionPayload } from 'shared/types'
import { selectLowestAsk, selectActivePositions, selectHighestBid, selectMeansToBuy } from 'shared/sagas/selectors'
import { requestExecPosition, execNewOrder, updateMyTrade } from 'shared/actions'
import {
  identity, converge, add, find, gte, length, always, defaultTo, lt, ifElse, path,
  applySpec, nth, curry, not, equals, subtract, lte, prop, multiply, map, compose
} from 'ramda'

const maxChunksAmount = 5

const log = debug('worker')
const isOverMax = compose(lte(maxChunksAmount), length)
const getThreshold = converge(add, [ multiply(0.005), identity ])

const findPositionToCover = curry((bid: number) =>
  find(compose(gte(bid), compose(getThreshold, prop('price')))))

const isFundsAvaliableToBuy = curry((avaliable: number, price: number, amount: number) =>
  lte(avaliable, multiply(price, amount)))

const isTradeValidated = () => {}
const formatTradeToPosition = () => {}

export function* getChunkAmount(symbol: string) {
  return 0.01
}

export function* requestPositionSell(symbol: string) {
  yield call(getChunkAmount, symbol)

  const highestBid = yield select(selectHighestBid, symbol)
  const positionToCover = findPositionToCover(highestBid)(positions)
}

export function* requestPositionBuy(symbol: string) {
  const positions = yield select(selectActivePositions, symbol)
  if (isOverMax(positions))
    return log('The limit of active opened positions is reached')

  const amount = yield call(getChunkAmount, symbol)
  const price = yield select(selectLowestAsk)
  const avaliableMeans = yield select(selectMeansToBuy, symbol)
  const orderProps = { symbol, amount, price }

  if (!isFundsAvaliableToBuy(avaliableMeans, price, amount))
    return log('No funds avaliable on wallet for buy')

  log(`Request to buy ${amount} for ${price} of ${symbol}`)

  yield put(execNewOrder(orderProps))

  while (true) {
    const trade = yield take(updateMyTrade)
    if (isTradeValidated(trade, { symbol, amount, price }))
      return yield put(createPosition(formatTradeToPosition(trade)))
    else
      // use lenses for drop loop
      log(`Response does not match passed parameters`, { symbol, amount, price })
  }
}

export function* watchRequestPosition() {
  const payloadExec = compose(defaultTo(0), path([ 'payload', 'exec' ]))
  const payloadSymbol = compose(defaultTo(''), path([ 'payload', 'symbol' ]))

  const getExecSaga = ifElse(
    compose(lt(0), payloadExec),
    always(requestPositionBuy),
    always(requestPositionSell))

  while (true) {
    const action: RequestExecPositionPayload = yield take(requestExecPosition)
    const execSaga = getExecSaga(action)
    const symbol = payloadSymbol(action)
    yield fork(execSaga, symbol)
  }
}



// type OrderBookAsObject = { amount: number, price: number }
// // const orderToObj = applySpec({ id: nth(0), symbol: nth(3), amount: nth(6), price: nth(16) })
// const orderBookToObj: Variadic<OrderBookAsObject> = applySpec({ price: nth(0), amount: nth(2) })
// const checkVolumePass = curry((amount: number, ask: OrderBookAsObject) =>
//   lte(multiply(1.5, amount), prop('amount', ask)))
//
// const validateVolumes = curry((amount: number, asks: any[]) =>
//   map(compose(checkVolumePass(amount), orderBookToObj)))

// export function* getChunkAmount(symbol: string) {
//   yield select(selectLowestAsks)
// }
//
// export function* watchRequestBuy(symbol: string) {
//   const asks = yield select(selectLowestAsks)
//   const amount = yield call(getChunkAmount, symbol)
//   const asksToCover = validateVolumes(amount)(asks)
//
//
//   const avaliableToBuy = yield select(selectAmountToBuy)
//   const inCurrency = multiply(lowestAskPrice)
//
//   if (inCurrency(avaliableToBuy) < amount) {
//     debug('worker')(`Not avaliable ${inCurrency(avaliableToBuy)} for chunk ${amount}`)
//     return false
//   }
//
//   yield call(newBuyOrderSaga, symbol, amount)
//
//   while (true) {
//     yield take(checkIntervalChannel)
//     const order = yield select(selectActiveOrder, symbol)
//     if (!order) return true
//     yield fork(updateBuyOrderSaga, order)
//   }
// }
