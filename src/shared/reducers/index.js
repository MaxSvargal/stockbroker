import { combineReducers } from 'redux'

import * as tradeLogs from './tradeLogs'
import * as stats from './stats'
import * as wallet from './wallet'
import * as transactions from './transactions'
import * as messages from './messages'

const reducers = Object.assign({}, tradeLogs, stats, transactions, wallet, messages)
const rootReducer = combineReducers(reducers)

export { reducers }
export default rootReducer
