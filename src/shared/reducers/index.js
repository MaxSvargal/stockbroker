import { combineReducers } from 'redux'

import { buy, sell } from './publicLogs'
import { myBuys, myFailureBuys, mySells, myFailureSells } from './myOrders'
import { wallet, currencies, currentPair, freeCurrencies, stats, statsEstimate, threshold, botMessages, finalCurrentResult } from './wallet'

const rootReducer = combineReducers({
  botMessages,
  buy,
  currencies,
  currentPair,
  finalCurrentResult,
  freeCurrencies,
  myBuys,
  myFailureBuys,
  myFailureSells,
  mySells,
  sell,
  stats,
  statsEstimate,
  threshold,
  wallet
})

export default rootReducer
