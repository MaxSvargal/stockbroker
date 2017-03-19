import { call, take, put, fork } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import PoloniexWSS from 'services/poloniex.wss'
import { orderBookModify, orderBookRemove, newTrade, setCurrency } from 'actions'

const channel = (session, topic) => eventChannel(emitter => {
  const sub = session.subscribe(topic, emitter)
  return () => session.unsubscribe(sub)
})

function* channelUsdtDash(session) {
  try {
    const channelUsdtDash = yield call(channel, session, 'USDT_ETH')
    while (true) {
      const data = yield take(channelUsdtDash)
      for (const item of data) {
        switch (item.type) {
          case 'orderBookRemove': yield put(orderBookRemove(item.data))
          case 'orderBookModify': yield put(orderBookModify(item.data))
          case 'newTrade': yield put(newTrade(item.data))
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}

function* channelTicker(session) {
  try {
    const channelTicker = yield call(channel, session, 'ticker')
    while (true) {
      const data = yield take(channelTicker)
      if (data[0] === 'USDT_ETH') yield put(setCurrency(data))
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
