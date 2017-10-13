import { createAction } from 'redux-act'
import * as Types from 'shared/types'

export const setPassiveTrading = createAction<Types.PassiveTradingPayload>('SET_PASSIVE_TRADING')
export const execNewOrder = createAction<Types.NewOrderPayload>('EXEC_NEW_ORDER')
export const execCancelOrder = createAction<Types.CancelOrderPayload>('EXEC_CANCEL_ORDER')
export const requestNewPassiveOrder = createAction<Types.RequestNewPassiveOrderPayload>('REQUEST_NEW_PASSIVE_ORDER')
export const requestOrdersSequence = createAction<Types.RequestOrderSequencePayload>('REQUEST_ORDER_SEQUENCE')
export const addStochasticResult = createAction<number>('ADD_STOCHASTIC_RESULT')
export const addMACDResult = createAction<number>('ADD_MACD_RESULT')
