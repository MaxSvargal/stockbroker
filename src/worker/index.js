import PouchDB from 'pouchdb'
import { applyMiddleware, createStore, compose } from 'redux'
import { persistentStore } from 'redux-pouchdb'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducers'
import rootSaga from './sagas'

const { DB_PATH } = process.env
const dbName = [ account, currencyOne.toUpperCase(), currencyTwo.toUpperCase() ].join('_')
const pouchDB = new PouchDB(`http://localhost:5984/${'test'}`, { adapter: 'leveldb', revs_limit: 1, auto_compaction: true })
const sagaMiddleware = createSagaMiddleware()
const middlewares = applyMiddleware(sagaMiddleware)
const persist = persistentStore(pouchDB)
const createStoreWithMiddleware = compose(persist, middlewares)(createStore)
const store = createStoreWithMiddleware(rootReducer)

sagaMiddleware.run(rootSaga)

export default store
