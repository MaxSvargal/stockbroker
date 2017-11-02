import { createReducer } from 'redux-act'
import { __, append, assoc, prop, find, propEq, and, map, contains, merge, always, ifElse, compose } from 'ramda'

import { createPosition } from 'shared/actions'
import { PositionPayload } from 'shared/types'

export type PositionsState = PositionPayload[]
const positionsReducer = createReducer({}, <PositionsState>[])

positionsReducer.on(createPosition, (state, payload: PositionPayload) =>
  append(payload, state))

export default positionsReducer
