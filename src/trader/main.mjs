// @flow

const inc = (a:number): number => ++a

export default function add(a: number, b: number): number {
  return a + inc(b)
}

// const PouchDB = require('pouchdb')
// const debug = require('debug')
// import PouchDB from 'pouchdb'
// import immutable form 'immutable'
// import { applyMiddleware, createStore, compose } from 'redux'
// import { persistentStore } from 'redux-pouchdb-plus'
// import createSagaMiddleware from 'redux-saga'
//
// import rootReducer from './reducers'
// import rootSaga from './sagas'
//
// // require('events').EventEmitter.defaultMaxListeners = 30
//
// const { ACCOUNT, PAIR } = process.env
//
// const connectToDB = () => {
//   const dbPath = `http://127.0.0.1:5984/${ACCOUNT}_${PAIR.toLowerCase()}`
//   // debug('worker')('Use database %s', dbPath)
//   console.log(typeof PouchDB)
//   return PouchDB(dbPath, {
//     ajax: {
//       cache: true,
//       timeout: 120000
//     },
//     auth: {
//       username: 'worker',
//       password: 'hUY7t9H7tfdF5d7oI93gVfgd'
//     }
//   })
// }
//
// const db = connectToDB()
// console.log(db)
//
// export default db
// const sagaMiddleware = createSagaMiddleware()
// const middlewares = applyMiddleware(sagaMiddleware)
// const persist = persistentStore({ db })
// const createStoreWithMiddleware = compose(middlewares, persist)(createStore)
// const store = createStoreWithMiddleware(rootReducer)
//
// sagaMiddleware.run(rootSaga)
//
// export default store
