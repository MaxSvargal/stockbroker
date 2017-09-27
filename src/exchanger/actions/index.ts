import { createAction } from 'redux-act'
import {
  CandlePayload,
  CandlesPayload,
  OrderBookPayload,
  TickerPayload,
  TradePayload,
  TradesPayload,
  WalletData
} from 'shared/types'

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
export const updateTicker = createAction<TickerPayload>('UPDATE_TICKER')
export const updateWallet = createAction<WalletData>('UPDATE_WALLET')
