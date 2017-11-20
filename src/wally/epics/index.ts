import { combineEpics } from 'redux-observable'
import { connect, auth, watchChannels, newOrder, newOrderRequest } from './bitfinex'

const rootEpic = combineEpics(newOrder, newOrderRequest, watchChannels, auth, connect)

export default rootEpic
