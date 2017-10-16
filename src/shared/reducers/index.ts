import { Reducer, Action, combineReducers } from 'redux'
import ReduxRedisPersist from 'shared/services/redisService'

import asks from './asks'
import bids from './bids'
import trades from './trades'
import wallet from './wallet'
import candles from './candles'
import tickers from './tickers'
import macd from './macd'

const reducers: { [name: string]: Reducer<any> } = {
  asks, bids, trades, wallet, candles, tickers, macd
}

export default function getRootReducer(persistDB: ReduxRedisPersist) {
  const persistentReducers = Object.keys(reducers).reduce((obj, name) =>
    ({ ...obj, [name]: persistDB.persistentReducer(reducers[name], { name }) }), {})
  return combineReducers(persistentReducers)
}
