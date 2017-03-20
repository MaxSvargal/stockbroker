import { createAction } from 'redux-act'

export const orderBookModify = createAction('ORDER_BOOK_MODIFY')
export const orderBookRemove = createAction('ORDER_BOOK_REMOVE')
export const newTrade = createAction('NEW_TRADE')
export const setCurrency = createAction('SET_CURRENCY')
export const setTrends = createAction('SET_TRENDS')
export const setCurrencyPair = createAction('SET_CURRENCY_PAIR')
