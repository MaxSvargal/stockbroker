// import { testSaga } from 'redux-saga-test-plan'
// // import { testWhenSaga } from '../redisRPC'
// import { updateMyTrade, execNewOrder } from 'shared/actions'
//
// test.skip('testWhenSaga', () => {
//   // export function* testWhenSaga(procedures: SimpleActionCreator<{}>, action: { type: string }) {
//   //   const isTypeEnabled = curry((arr: any, action: { type: string }) =>
//   //     any(equals(action.type))(arr))(map(p => p.toString(), procedures))
//   //
//   //   if (isTypeEnabled(action)) yield put(action)
//   // }
//
//   testSaga(testWhenSaga, [ updateMyTrade, execNewOrder ], { type: 'UPDATE_MY_TRADE', payload: [] })
//     .next()
//     .put({ type: 'UPDATE_MY_TRADE', payload: [] })
//     .next()
//     .isDone()
// })
