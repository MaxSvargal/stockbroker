import { createAction } from 'redux-act'
import { requestOrderPayload } from 'shared/types'

export const execAgressiveBuy = createAction<requestOrderPayload>('EXEC_AGRESSIVE_BUY')
export const execAgressiveSell = createAction<requestOrderPayload>('EXEC_AGRESSIVE_SELL')
export const execPassiveBuy = createAction<requestOrderPayload>('EXEC_PASSIVE_BUY')
export const execPassiveSell = createAction<requestOrderPayload>('EXEC_PASSIVE_SELL')
