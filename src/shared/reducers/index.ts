import { Reducer, combineReducers } from 'redux'
import { persistentReducer } from 'redux-pouchdb-rethink'

import orderbook from './orderbook'
import trades from './trades'
import wallet from './wallet'
import candles from './candles'
import tickers from './tickers'
import macd from './macd'

const reducers: { [name: string]: Reducer<any> } = { orderbook, trades, wallet, candles, tickers, macd }

const persistentReducers = Object.keys(reducers).reduce((obj, name) =>
  ({ ...obj, [name]: persistentReducer(reducers[name], { name }) }), {})

const rootReducer = combineReducers(persistentReducers)

export default rootReducer
