import { Reducer, Action, combineReducers } from 'redux'
import ReduxRedisPersist from 'shared/services/redisService'

import book from './orderBook'
import candles from './candles'
import macd from './macd'
import positions from './positions'
import rvi from './rvi'
import stoch from './stoch'
import tickers from './tickers'
import trades from './trades'
import wallet from './wallet'

const reducers: { [name: string]: Reducer<any> } = {
  book, candles, macd, positions, rvi, stoch, tickers, trades, wallet
}

export default function getRootReducer(persistDB: ReduxRedisPersist) {
  const persistentReducers = Object.keys(reducers).reduce((obj, name) =>
    ({ ...obj, [name]: persistDB.persistentReducer(reducers[name], { name }) }), {})
  return combineReducers(persistentReducers)
}
