import debug from 'debug'
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootSaga from './sagas'
import getRootReducer from 'shared/reducers'
import ReduxRedisPersist from 'shared/services/redisService'

const { ACCOUNT = 'demo' } = process.env

debug('worker')('Welcome to stockbroker\'s Mc\'Stoch trader, %s!', ACCOUNT)

const sagaMiddleware = createSagaMiddleware()
const db = new ReduxRedisPersist({
  prefix: ACCOUNT,
  avalialbleToSet: [ 'macd' ],
  avalialbleToSubscribe: [ 'asks', 'bids', 'wallet', 'candles', 'tickers' ]
})

const rootReducer = getRootReducer(db)
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

db.setStore(store)
db.subscriber.on('ready', () => {
  debug('worker')('Connection to redis database established')
  sagaMiddleware.run(rootSaga)
})

export { store, db }
