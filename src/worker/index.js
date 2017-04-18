import PouchDB from 'pouchdb'
import { applyMiddleware, createStore, compose } from 'redux'
import { persistentStore } from 'redux-pouchdb'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducers'
import rootSaga from './sagas'

const { NODE_ENV, DB_NAME } = process.env
const dbPath = NODE_ENV === 'development' ?
  `./server/db/${DB_NAME}` :
  `http://localhost:5984/${DB_NAME}`

console.log('Use database', dbPath)

const pouchDB = new PouchDB(dbPath)
const sagaMiddleware = createSagaMiddleware()
const middlewares = applyMiddleware(sagaMiddleware)
const persist = persistentStore(pouchDB)
const createStoreWithMiddleware = compose(persist, middlewares)(createStore)
const store = createStoreWithMiddleware(rootReducer)

sagaMiddleware.run(rootSaga)

export default store
