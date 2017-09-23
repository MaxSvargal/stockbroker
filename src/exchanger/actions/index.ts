import { createAction } from 'redux-act'

export type PAIR = string
export type ID = number
export type MTS = number
export type PRICE = number
export type COUNT = number
export type AMOUNT = number
export type WALLET_TYPE = string
export type CURRENCY = string
export type BALANCE = number
export type UNSETTLED_INTEREST = number
export type BALANCE_AVAILABLE = number | null

export type TradeData = [ ID, MTS, AMOUNT, PRICE ]
export type TradePayload = { pair: PAIR, data: TradeData }
export type TradesPayload = { pair: PAIR, data: TradeData[] }

export type OrderBookPayload = [ PRICE, COUNT, AMOUNT ]
export type WalletData = [ WALLET_TYPE, CURRENCY, BALANCE, UNSETTLED_INTEREST, BALANCE_AVAILABLE ]
export type WalletPayload = WalletData[]

export const cancelOrder = createAction('CANCEL_ORDER')
export const createOrder = createAction('CREATE_ORDER')
export const makeCancelOrder = createAction('MAKE_CANCEL_ORDER')
export const newOrder = createAction('NEW_ORDER')
export const addTrade = createAction<TradePayload>('ADD_TRADE')
export const setTrades = createAction<TradesPayload>('SET_TRADES')
export const setCurrency = createAction('SET_CURRENCY')
export const setOrderBook = createAction<OrderBookPayload[]>('SET_ORDER_BOOK')
export const setOrders = createAction('SET_ORDERS')
export const setWallet = createAction<WalletPayload[]>('SET_WALLET')
export const tradeExecute = createAction('TRADE_EXECUTE')
export const updateOrder = createAction('UPDATE_ORDER')
export const updateOrderBook = createAction<OrderBookPayload>('UPDATE_ORDER_BOOK')
export const updateWallet = createAction<WalletPayload>('UPDATE_WALLET')
