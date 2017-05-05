import debug from 'debug'
import PouchDB from 'pouchdb'
import { applyMiddleware, createStore, compose } from 'redux'
import { persistentStore } from 'redux-pouchdb'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducers'
import rootSaga from './sagas'

const connectToDB = () => {
  const dbPath = `http://127.0.0.1:5984/${process.env.DB_NAME}`
  debug('worker')('Use database %s', dbPath)
  return new PouchDB(dbPath, { auth: { username: 'worker', password: 'hUY7t9H7tfdF5d7oI93gVfgd' } })
}

const pouchDB = connectToDB()
const sagaMiddleware = createSagaMiddleware()
const middlewares = applyMiddleware(sagaMiddleware)
const persist = persistentStore(pouchDB)
const createStoreWithMiddleware = compose(persist, middlewares)(createStore)
const store = createStoreWithMiddleware(rootReducer)

sagaMiddleware.run(rootSaga)

export default store
