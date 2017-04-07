import { combineReducers } from 'redux'
import { persistentReducer } from 'redux-pouchdb'

import * as tradeLogs from './tradeLogs'
import * as stats from './stats'
import * as wallet from './wallet'
import * as transactions from './transactions'

const reducers = Object.assign({}, tradeLogs, stats, transactions, wallet)
const persistentReducers = Object.keys(reducers).reduce((obj, key) =>
  Object.assign({}, obj, { [key]: persistentReducer(reducers[key], key) }), {})

const rootReducer = combineReducers(persistentReducers)

export default rootReducer
