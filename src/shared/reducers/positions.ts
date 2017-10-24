import { createReducer } from 'redux-act'
import { append, assoc, prop } from 'ramda'

import { openPosition, closePosition } from 'shared/actions'
import { PosisionPayload } from 'shared/types'

export type PositionsState = PosisionPayload[]
const positionsReducer = createReducer<PositionsState>({}, [])

positionsReducer.on(openPosition, (state, payload: PosisionPayload) =>
  append(payload, state))

positionsReducer.on(closePosition, (state, payload: PosisionPayload) =>
  append(payload, state))

export default positionsReducer
