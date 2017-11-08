import { call, take, fork } from 'redux-saga/effects'
import { eventChannel, END, SagaIterator } from 'redux-saga'
import { BFX } from 'bitfinex-api-node'

const channel = (bws: BFX, name: string) => eventChannel(emitter => {
  bws.on(name, (...data: any[]) => emitter(data))
  bws.on('close', () => emitter(END))
  return () => bws.ws.close.bind(bws)
})

export default function* channelSaga(bws: BFX, name: string, saga: (...data: any[]) => SagaIterator) {
  try {
    const chan = yield call(channel, bws, name)
    while (true) {
      const data = yield take(chan)
      yield fork(saga, ...data)
    }
  } catch (err) {
    console.error('Channel closed', err)
  }
}
