import { createAction } from 'redux-act'
import * as Types from 'shared/types'

export const setAccount = createAction<string>('SET_ACCOUNT')
export const setPassiveTrading = createAction<Types.PassiveTradingPayload>('SET_PASSIVE_TRADING')
export const execNewOrder = createAction<Types.NewOrderPayload>('EXEC_NEW_ORDER')
export const execCancelOrder = createAction<Types.CancelOrderPayload>('EXEC_CANCEL_ORDER')
export const requestNewPassiveOrder = createAction<Types.RequestNewPassiveOrderPayload>('REQUEST_NEW_PASSIVE_ORDER')
export const requestOrdersSequence = createAction<Types.RequestOrderSequencePayload>('REQUEST_ORDER_SEQUENCE')
export const addMACDResult = createAction<Types.AddMACDResultPayload>('ADD_MACD_RESULT')
export const clearMACDResults = createAction<Types.ClearMACDResultsPayload>('CLEAR_MACD_RESULTS')
export const openPosition = createAction<Types.ChangePositionPayload>('OPEN_POSITION')
export const closePosition = createAction<Types.ChangePositionPayload>('CLOSE_POSITION')
