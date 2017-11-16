import { combineEpics } from 'redux-observable'

// import positionsEpic, { testEpic } from './positions'
import { connect, auth, watchChannels, newOrder } from './bitfinex'

const rootEpic = combineEpics(newOrder, watchChannels, auth, connect)

export default rootEpic
