import debug from 'debug'
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import getRootReducer from 'shared/reducers'
import rootSaga from './sagas'
import connectToDB from 'shared/services/pouchdbService'

import ReduxRedisPersist from 'shared/services/redisService'

const { ACCOUNT = 'demo' } = process.env

debug('worker')('Connect to database %s', ACCOUNT)

const sagaMiddleware = createSagaMiddleware()
const persistDB = new ReduxRedisPersist({
  prefix: ACCOUNT,
  avalialbleToSet: [ 'macd' ],
  avalialbleToSubscribe: [ 'asks', 'bids', 'wallet', 'candles', 'tickers' ]
})

const rootReducer = getRootReducer(persistDB)
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

persistDB.setStore(store)
persistDB.subscriber.on('ready', () => {
  debug('worker')('Connection to Redis estableashed')
  sagaMiddleware.run(rootSaga)
})

export default store
