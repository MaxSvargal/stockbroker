import PouchDB from 'pouchdb'
import pouchDBAuthentication from 'pouchdb-authentication'
import { applyMiddleware, createStore, compose } from 'redux'
import { persistentStore } from 'redux-pouchdb'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducers'
import rootSaga from './sagas'

const connectToDB = () => {
  const dbPath = `http://127.0.0.1:5984/${process.env.DB_NAME}`
  console.log('Use database', dbPath)
  PouchDB.plugin(pouchDBAuthentication)
  const db = new PouchDB(dbPath, { skipSetup: true })
  db.login('worker', 'hUY7t9H7tfdF5d7oI93gVfgd')
    .then(() => console.log('Logged to database as worker'))
    .catch(err => console.error('Database connection error', err))
  return db
}

const pouchDB = connectToDB()
const sagaMiddleware = createSagaMiddleware()
const middlewares = applyMiddleware(sagaMiddleware)
const persist = persistentStore(pouchDB)
const createStoreWithMiddleware = compose(persist, middlewares)(createStore)
const store = createStoreWithMiddleware(rootReducer)

sagaMiddleware.run(rootSaga)

export default store
