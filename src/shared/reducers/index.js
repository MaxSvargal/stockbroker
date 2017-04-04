import { combineReducers } from 'redux'
import { persistentReducer } from 'redux-pouchdb'

import { buy, sell } from './publicLogs'
import { myBuys, myFailureBuys, mySells, myFailureSells } from './myOrders'
import { wallet, currencies, currentPair, freeCurrencies, stats, statsEstimate, threshold, botMessages, finalCurrentResult } from './wallet'

const rootReducer = combineReducers({
  botMessages: persistentReducer(botMessages),
  buy: persistentReducer(buy),
  currencies: persistentReducer(currencies),
  currentPair: persistentReducer(currentPair),
  finalCurrentResult: persistentReducer(finalCurrentResult),
  freeCurrencies: persistentReducer(freeCurrencies),
  myBuys: persistentReducer(myBuys),
  myFailureBuys: persistentReducer(myFailureBuys),
  myFailureSells: persistentReducer(myFailureSells),
  mySells: persistentReducer(mySells),
  sell: persistentReducer(sell),
  stats: persistentReducer(stats),
  statsEstimate: persistentReducer(statsEstimate),
  threshold: persistentReducer(threshold),
  wallet: persistentReducer(wallet)
})

export default rootReducer
