import { combineEpics } from 'redux-most'
import watchRequestPosition from './positions'

const rootEpic = combineEpics([
  watchRequestPosition
])

export default rootEpic
