import { Reducer, combineReducers } from 'redux'
import { persistentReducer } from 'redux-pouchdb-plus'

import orderbook from './orderbook'
import trades from './trades'
import wallet from './wallet'
import candles from './candles'

const reducers: { [name: string]: Reducer<any> } = { orderbook, trades, wallet, candles }

const persistentReducers = Object.keys(reducers).reduce((obj, name) =>
  ({ ...obj, [name]: persistentReducer(reducers[name], { name }) }), {})

const rootReducer = combineReducers(persistentReducers)

export default rootReducer
