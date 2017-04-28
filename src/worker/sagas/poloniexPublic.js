import { call, take, put, fork, select, cancelled } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'

import { orderBookModify, orderBookRemove, newTrade, setCurrency } from '../../shared/actions'
import PoloniexWSS from '../services/poloniexPublic'
import { selectCurrencyPair } from './selectors'

const channel = (session, topic) => eventChannel(emitter => {
  const sub = session.subscribe(topic, emitter)
  /* eslint no-underscore-dangle: 0 */
  /* eslint no-param-reassign: 0 */
  session._socket.onclose = () => emitter(END)
  return () => session.unsubscribe(sub)
})

/* eslint no-unused-vars: 1 */
function* channelUsdtDash(session) {
  const currencyPair = yield select(selectCurrencyPair)
  const chan = yield call(channel, session, currencyPair)

  try {
    while (true) {
      const data = yield take(chan)
      /* eslint no-restricted-syntax: 0 */
      for (const item of data) {
        if (item.data.type === 'sell' || item.data.type === 'buy') {
          switch (item.type) {
            case 'orderBookRemove':
              yield put(orderBookRemove(item.data))
              break
            case 'orderBookModify':
              yield put(orderBookModify(item.data))
              break
            case 'newTrade':
              yield put(newTrade(item.data))
              break
            default:
              break
          }
        }
      }
    }
  } finally {
    console.log('Poloniex connection closed for currency channel.')
    if (yield cancelled()) chan.close()
    yield fork(poloniexPublicSaga)
  }
}

function* channelTicker(session) {
  const currencyPair = yield select(selectCurrencyPair)
  const chan = yield call(channel, session, 'ticker')
  let lastTickerValue = 0

  try {
    while (true) {
      const data = yield take(chan)
      if (data[0] === currencyPair) {
        if (data[1] !== lastTickerValue)
          yield put(setCurrency(data))
        lastTickerValue = data[1]
      }
    }
  } finally {
    console.log('Poloniex connection closed for ticker.')
    if (yield cancelled()) chan.close()
    yield fork(poloniexPublicSaga)
  }
}

function* bootstrap(session) {
  yield [
    fork(channelUsdtDash, session),
    fork(channelTicker, session)
  ]
}

export default function* poloniexPublicSaga() {
  const session = yield call(PoloniexWSS)
  yield fork(bootstrap, session)
}
