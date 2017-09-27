import debug from 'debug'
import { applyMiddleware, compose, createStore } from 'redux'
import { persistentStore } from 'redux-pouchdb-rethink'
import createSagaMiddleware from 'redux-saga'

import rootReducer from 'shared/reducers'
import rootSaga from './sagas'
import connectToDB from 'shared/services/pouchdbService'

const { ACCOUNT = 'demo' } = process.env

debug('worker')('Connect to database %s', ACCOUNT)

const db = connectToDB(ACCOUNT)
const sagaMiddleware = createSagaMiddleware()
const middlewares = applyMiddleware(sagaMiddleware)
const persist = persistentStore({ db })
const store = createStore(rootReducer, compose(middlewares, persist))

sagaMiddleware.run(rootSaga)

export default store
