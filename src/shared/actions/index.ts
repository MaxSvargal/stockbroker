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
export const updateMyTrade = createAction<Types.MyTradeData>('UPDATE_MY_TRADE')
export const requestExecPosition = createAction<Types.RequestExecPositionPayload>('REQUEST_EXEC_POSITION')


export const bitfinexConnect = createAction('BITFINEX_CONNECT')
export const bitfinexConnected = createAction<any>('BITFINEX_CONNECTED')
export const bitfinexRejected = createAction('BITFINEX_REJECTED')
export const bitfinexAuthorized = createAction('BITFINEX_AUTHORIZED')
