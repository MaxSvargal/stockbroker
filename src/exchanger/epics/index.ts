import { combineEpics } from 'redux-observable'
import {
  connect, subscribeToChannels,
  watchCandlesChannel, watchTickerChannel, watchOrderbookChannel
} from './bitfinex'

const rootEpic = (symbol: string) =>
  combineEpics(
    subscribeToChannels(symbol),
    watchCandlesChannel,
    watchTickerChannel,
    watchOrderbookChannel,
    connect
  )

export default rootEpic
