import { createAction } from 'redux-act'

export type AMOUNT = number
export type BALANCE = number
export type BALANCE_AVAILABLE = number | null
export type CLOSE = number
export type COUNT = number
export type CURRENCY = string
export type HIGHT = number
export type ID = number
export type LOW = number
export type MTS = number
export type OPEN = number
export type PAIR = string
export type PRICE = number
export type UNSETTLED_INTEREST = number
export type VOLUME = number
export type WALLET_TYPE = string
export type KEY = string

export type CandleData = [ MTS, OPEN, CLOSE, HIGHT, LOW, VOLUME ]
export type CandlePayload = { key: KEY, data: CandleData }
export type CandlesPayload = { key: KEY, data: CandleData[] }
export type OrderBookPayload = [ PRICE, COUNT, AMOUNT ]
export type TradeData = [ ID, MTS, AMOUNT, PRICE ]
export type TradePayload = { pair: PAIR, data: TradeData }
export type TradesPayload = { pair: PAIR, data: TradeData[] }
export type WalletData = [ WALLET_TYPE, CURRENCY, BALANCE, UNSETTLED_INTEREST, BALANCE_AVAILABLE ]

export const addTrade = createAction<TradePayload>('ADD_TRADE')
export const cancelOrder = createAction('CANCEL_ORDER')
export const createOrder = createAction('CREATE_ORDER')
export const makeCancelOrder = createAction('MAKE_CANCEL_ORDER')
export const newOrder = createAction('NEW_ORDER')
export const setCandles = createAction<CandlesPayload>('SET_CANDLES')
export const setCurrency = createAction('SET_CURRENCY')
export const setOrderBook = createAction<OrderBookPayload[]>('SET_ORDER_BOOK')
export const setOrders = createAction('SET_ORDERS')
export const setTrades = createAction<TradesPayload>('SET_TRADES')
export const setWallet = createAction<WalletData[]>('SET_WALLET')
export const tradeExecute = createAction('TRADE_EXECUTE')
export const updateCandle = createAction<CandlePayload>('UPDATE_CANDLE')
export const updateOrder = createAction('UPDATE_ORDER')
export const updateOrderBook = createAction<OrderBookPayload>('UPDATE_ORDER_BOOK')
export const updateWallet = createAction<WalletData>('UPDATE_WALLET')
