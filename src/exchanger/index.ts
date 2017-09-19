import debug from 'debug'
import PouchDB from 'pouchdb'
import immutable from 'immutable'
import { applyMiddleware, createStore, compose } from 'redux'
import { persistentStore } from 'redux-pouchdb-plus'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducers'
import rootSaga from './sagas'

// require('events').EventEmitter.defaultMaxListeners = 30

const { ACCOUNT } = process.env

const connectToDB = () => {
  const dbPath = `http://127.0.0.1:5984/${ACCOUNT}`
  debug('worker')('Connect to database %s', dbPath)
  return PouchDB(dbPath, {
    ajax: {
      cache: true,
      timeout: 120000
    },
    auth: {
      username: 'worker',
      password: 'hUY7t9H7tfdF5d7oI93gVfgd'
    }
  })
}

const db = connectToDB()
console.log(db)

const sagaMiddleware = createSagaMiddleware()
const middlewares = applyMiddleware(sagaMiddleware)
const persist = persistentStore({ db })
const createStoreWithMiddleware = compose(middlewares, persist)(createStore)
const store = createStoreWithMiddleware(rootReducer)

sagaMiddleware.run(rootSaga)

export default store
