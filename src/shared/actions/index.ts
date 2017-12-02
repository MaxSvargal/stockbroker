import { createAction } from 'redux-act'
import * as Types from 'shared/types'

export const addMACDResult = createAction<Types.AddMACDResultPayload>('ADD_MACD_RESULT')
export const addRVIResult = createAction<Types.AddRVIResultPayload>('ADD_RVI_RESULT')
export const addStochResult = createAction<Types.AddStochResultPayload>('ADD_STOCH_RESULT')
export const clearMACDResults = createAction<Types.ClearSignalResultsPayload>('CLEAR_MACD_RESULTS')
export const clearRVIResults = createAction<Types.ClearSignalResultsPayload>('CLEAR_RVI_RESULTS')
export const clearStochResults = createAction<Types.ClearSignalResultsPayload>('CLEAR_STOCH_RESULTS')
export const createPosition = createAction<Types.PositionPayload>('CREATE_POSITION')
export const execCancelOrder = createAction<Types.CancelOrderPayload>('EXEC_CANCEL_ORDER')
export const execNewOrder = createAction<Types.NewOrderPayload>('EXEC_NEW_ORDER')
export const requestNewPassiveOrder = createAction<Types.RequestNewPassiveOrderPayload>('REQUEST_NEW_PASSIVE_ORDER')
export const requestOrdersSequence = createAction<Types.RequestOrderSequencePayload>('REQUEST_ORDER_SEQUENCE')
export const setAccount = createAction<string>('SET_ACCOUNT')
export const setPassiveTrading = createAction<Types.PassiveTradingPayload>('SET_PASSIVE_TRADING')
export const tooMuchOpenedPositions = createAction('TOO_MUCH_OPENED_POSITIONS')
export const noPositionsToCover = createAction('NO_POSITIONS_TO_COVER')
// export const updateMyTrade = createAction<Types.MyTradeData>('UPDATE_MY_TRADE')
export const requestExecPosition = createAction<Types.RequestExecPositionPayload>('REQUEST_EXEC_POSITION')

export const initialized = createAction('INITIALIZED')
export const bitfinexSubscribed = createAction('BITFINEX_SUBSCRIBED')
export const bitfinexConnected = createAction<any>('BITFINEX_CONNECTED')
export const bitfinexRejected = createAction<Error>('BITFINEX_REJECTED')
export const bitfinexAuthRejected = createAction<Error>('BITFINEX_AUTH_REJECTED')
export const bitfinexAuthorized = createAction('BITFINEX_AUTHORIZED')
export const bitfinexHeartbeat = createAction('BITFINEX_HEARTBEAT')

export const setWallet = createAction<Types.WalletData[]>('SET_WALLET')
export const updateWallet = createAction<Types.WalletData>('UPDATE_WALLET')
export const setOrders = createAction<any[]>('SET_ORDERS')
export const orderCreate = createAction<any[]>('ORDER_CREATE')
export const orderUpdate = createAction<any[]>('ORDER_UPDATE')
export const orderCancel = createAction<any[]>('ORDER_CANCEL')
export const updateMyTrade = createAction<any>('UPDATE_MY_TRADE')

export const signalRequest = createAction<any>('SIGNAL_REQUEST')
export const signalRequestResolved = createAction<any>('SIGNAL_REQUEST_RESOLVED')
export const signalRequestRejected = createAction<any>('SIGNAL_REQUEST_REJECTED')

export const setCandles = createAction<Types.CandlesPayload>('SET_CANDLES')
export const updateCandle = createAction<any>('UPDATE_CANDLE')
export const setOrderBook = createAction<Types.SetOrderBookPayload>('SET_ORDER_BOOK')
export const updateOrderBook = createAction<Types.UpdateOrderBookPayload>('UPDATE_ORDER_BOOK')

export const updateTicker = createAction<Types.TickerPayload>('UPDATE_TICKER')

export const addRSIResult = createAction<Types.AddRSIPayload>('ADD_RSI_RESULT')
