import PouchDB from 'pouchdb'
import { applyMiddleware, createStore, compose } from 'redux'
import { persistentStore } from 'redux-pouchdb'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducers'
import rootSaga from './sagas'

const { DB_NAME } = process.env
console.log('Use database', DB_NAME)

const pouchDB = new PouchDB(`http://localhost:5984/${DB_NAME}`)
const sagaMiddleware = createSagaMiddleware()
const middlewares = applyMiddleware(sagaMiddleware)
const persist = persistentStore(pouchDB)
const createStoreWithMiddleware = compose(persist, middlewares)(createStore)
const store = createStoreWithMiddleware(rootReducer)

sagaMiddleware.run(rootSaga)

export default store
