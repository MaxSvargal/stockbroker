import { combineReducers } from 'redux'
import { persistentReducer } from 'redux-pouchdb-rethink'

import orderbook from './orderbook'
import stats from './stats'
import { trades, tradeDynamics } from './trades'
import { myTrades, tradePosition } from './transactions'
import wallet from './wallet'

const reducers = { orderbook, orders, trades, tradeDynamics, myTrades, tradePosition, wallet }

const persistentReducers = Object.keys(reducers).reduce((obj, key) =>
  Object.assign({}, obj, {
    [key]: key !== 'orderbook' ? persistentReducer(reducers[key], { name: key }) : reducers[key]
  }), {})

const rootReducer = combineReducers(persistentReducers)

export default rootReducer
