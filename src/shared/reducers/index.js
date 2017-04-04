import { combineReducers } from 'redux'
import { persistentReducer } from 'redux-pouchdb'

import * as publicLogs from './publicLogs'
import * as myOrders from './myOrders'
import * as wallet from './wallet'

const reducers = Object.assign({}, publicLogs, myOrders, wallet)
const persistentReducers = Object.keys(reducers).reduce((obj, key) =>
  Object.assign({}, obj, { [key]: persistentReducer(reducers[key], key) }), {})

const rootReducer = combineReducers(persistentReducers)

export default rootReducer
