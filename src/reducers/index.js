import { combineReducers } from 'redux'

import { buy, sell } from 'reducers/publicLogs'
import { myBuys, myFailureBuys, mySells, myFailureSells } from 'reducers/myOrders'
import { wallet, currencies, currentPair, freeCurrencies, stats, statsEstimate, threshold, botMessages, finalCurrentResult } from 'reducers/wallet'

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
