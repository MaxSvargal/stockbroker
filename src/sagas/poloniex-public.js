import { call, take, put, fork } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import PoloniexWSS from 'services/poloniex.wss'
import { orderBookModify, orderBookRemove, newTrade, setCurrency } from 'actions'
import { CURRENT_PAIR } from 'const'

const channel = (session, topic) => eventChannel(emitter => {
  const sub = session.subscribe(topic, emitter)
  return () => session.unsubscribe(sub)
})

/* eslint no-unused-vars: 1 */
function* channelUsdtDash(session) {
  try {
    const currChan = yield call(channel, session, CURRENT_PAIR)
    while (true) {
      const data = yield take(currChan)
      /* eslint no-restricted-syntax: 0 */
      for (const item of data) {
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
  } catch (err) {
    console.log(err)
  }
}

function* channelTicker(session) {
  try {
    const chanTicker = yield call(channel, session, 'ticker')
    let lastTickerValue = 0

    while (true) {
      const data = yield take(chanTicker)
      if (data[0] === CURRENT_PAIR) {
        if (data[1] !== lastTickerValue) {
          yield put(setCurrency(data))
        }
        lastTickerValue = data[1]
      }
    }
  } catch (err) {
    console.log(err)
  }
}

function* bootstrap(session) {
  yield [
    fork(channelUsdtDash, session),
    fork(channelTicker, session)
  ]
}

export default function* poloniexPublicSaga() {
  try {
    const session = yield call(PoloniexWSS)
    yield fork(bootstrap, session)
  } catch (err) {
    console.log('WSS Disconnected')
  }
}
