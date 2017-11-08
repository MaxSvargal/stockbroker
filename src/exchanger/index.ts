import debug from 'debug'
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootSaga from './sagas'
import getRootReducer from 'shared/reducers'
import ReduxRedisPersist from 'shared/services/redisService'

require('events').EventEmitter.defaultMaxListeners = 15

const { ACCOUNT = 'demo' } = process.env

debug('worker')('Welcome to stockbroker\'s exchanger, %s!', ACCOUNT)

const sagaMiddleware = createSagaMiddleware()
const db = new ReduxRedisPersist({
  prefix: ACCOUNT,
  avalialbleToSet: [ 'asks', 'bids', 'wallet', 'candles', 'tickers' ]
})

const rootReducer = getRootReducer(db)
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

db.setStore(store)
db.publisher.on('ready', () => {
  debug('worker')('Connection to redis server established')
  sagaMiddleware.run(rootSaga)
})

export { store, db }
