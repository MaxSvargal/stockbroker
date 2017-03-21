import test from 'ava'
import testSaga from 'redux-saga-test-plan'
import { fork } from 'redux-saga/effects'
import tradeEmulatorSaga, { watchConclusions, watchTotals } from 'sagas/emulator'

test('Emulator test', () =>
  testSaga(tradeEmulatorSaga)
    .next()
    .parallel([
      fork(watchConclusions),
      fork(watchTotals)
    ]))
