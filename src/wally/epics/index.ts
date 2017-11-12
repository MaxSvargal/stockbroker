import { combineEpics } from 'redux-observable'

// import positionsEpic, { testEpic } from './positions'
import { connect, auth } from './bitfinex'

const rootEpic = combineEpics(connect, auth)

export default rootEpic
