import { createAction } from 'redux-act'

export const addChunks = createAction('ADD_CHUNKS')
export const addStats = createAction('ADD_STATS')
export const botMessage = createAction('BOT_MESSAGE')
export const buyFailure = createAction('BUY_FAILURE')
export const buySuccess = createAction('BUY_SUCCESS')
export const doBuy = createAction('DO_BUY')
export const doSell = createAction('DO_SELL')
export const getCurrentPair = createAction('GET_CURRENT_PAIR')
export const newTrade = createAction('NEW_TRADE')
export const orderBookModify = createAction('ORDER_BOOK_MODIFY')
export const orderBookRemove = createAction('ORDER_BOOK_REMOVE')
export const removeChunk = createAction('REMOVE_CHUNK')
export const requestNewChunks = createAction('REQUEST_NEW_CHUNKS')
export const sellFailure = createAction('SELL_FAILURE')
export const sellSuccess = createAction('SELL_SUCCESS')
export const setAutocreatedChunkAmount = createAction('SET_AUTOCREATED_CHUNK_AMOUNT')
export const setCurrency = createAction('SET_CURRENCY')
export const setCurrencyPair = createAction('SET_CURRENCY_PAIR')
export const setCurrentFinalResult = createAction('SET_CURRENT_FINAL_RESULT')
export const setFreeCurrencies = createAction('SET_FREE_CURRENCIES')
export const setObsoleteThreshold = createAction('SET_OBSOLETE_THRESHOLD')
export const setProfitThreshold = createAction('SET_PROFIT_THRESHOLD')
export const setTrends = createAction('SET_TRENDS')
export const updateWallet = createAction('UPDATE_WALLET')
