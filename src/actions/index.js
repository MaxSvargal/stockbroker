import { createAction } from 'redux-act'

export const addBuyChunks = createAction('ADD_BUY_CHUNKS')
export const addChunkedCurrency = createAction('ADD_CHUNKED_CURRENCY')
export const addSellChunks = createAction('ADD_SELL_CHUNKS')
export const addStats = createAction('ADD_STATS')
export const botMessage = createAction('BOT_MESSAGE')
export const buyFailure = createAction('BUY_FAILURE')
export const buySuccess = createAction('BUY_SUCCESS')
export const convertCurrencyToChunks = createAction('CONVERT_CURRENCY_TO_CHUNKS')
export const doBuy = createAction('DO_BUY')
export const doSell = createAction('DO_SELL')
export const getCurrentPair = createAction('GET_CURRENT_PAIR')
export const newTrade = createAction('NEW_TRADE')
export const orderBookModify = createAction('ORDER_BOOK_MODIFY')
export const orderBookRemove = createAction('ORDER_BOOK_REMOVE')
export const removeOpenBuys = createAction('REMOVE_OPEN_BUYS')
export const removeOpenSells = createAction('REMOVE_OPEN_SELLS')
export const sellFailure = createAction('SELL_FAILURE')
export const sellSuccess = createAction('SELL_SUCCESS')
export const sendBuys = createAction('SEND_BUYS')
export const sendSells = createAction('SEND_SELLS')
export const setCurrency = createAction('SET_CURRENCY')
export const setCurrencyPair = createAction('SET_CURRENCY_PAIR')
export const setFreeCurrencies = createAction('SET_FREE_CURRENCIES')
export const setThreshold = createAction('SET_THRESHOLD')
export const setTrends = createAction('SET_TRENDS')
export const updateWallet = createAction('UPDATE_WALLET')
