import { combineReducers } from 'redux'

import { buy, sell } from 'reducers/publicLogs'
import { myBuys, myFailureBuys, mySells, myFailureSells } from 'reducers/myOrders'
import { wallet, currencies, currentPair, freeCurrencies, stats, threshold, botMessages } from 'reducers/wallet'

const rootReducer = combineReducers({
  botMessages,
  buy,
  currencies,
  currentPair,
  freeCurrencies,
  myBuys,
  myFailureBuys,
  myFailureSells,
  mySells,
  sell,
  stats,
  threshold,
  wallet
})

export default rootReducer
