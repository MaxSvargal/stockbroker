import { combineEpics } from 'redux-observable'
import { connect, auth, watchChannels, newOrder, resolveOrderRequest } from './bitfinex'

const rootEpic = combineEpics(resolveOrderRequest, newOrder, watchChannels, auth, connect)

export default rootEpic
