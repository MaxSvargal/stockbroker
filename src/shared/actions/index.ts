import { createAction } from 'redux-act'
import { NewOrderPayload, CancelOrderPayload, PassiveTradingPayload } from 'shared/types'

export const setPassiveTrading = createAction<PassiveTradingPayload>('SET_PASSIVE_TRADING')
export const execNewOrder = createAction<NewOrderPayload>('EXEC_NEW_ORDER')
export const execCancelOrder = createAction<CancelOrderPayload>('EXEC_CANCEL_ORDER')
export const requestNewPassiveOrder = createAction('REQUEST_NEW_PASSIVE_ORDER')
