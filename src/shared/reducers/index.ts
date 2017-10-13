import { Reducer, combineReducers } from 'redux'
import { persistentReducer } from 'redux-pouchdb-rethink'

import orderbook from './orderbook'
import trades from './trades'
import wallet from './wallet'
import candles from './candles'
import tickers from './tickers'
import indicators from './indicators'

const reducers: { [name: string]: Reducer<any> } = { orderbook, trades, wallet, candles, tickers, indicators }

const persistentReducers = Object.keys(reducers).reduce((obj, name) =>
  ({ ...obj, [name]: persistentReducer(reducers[name], { name }) }), {})

const rootReducer = combineReducers(persistentReducers)

export default rootReducer
