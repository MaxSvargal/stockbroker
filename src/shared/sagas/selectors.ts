import { __, nth, defaultTo, path, head, reverse, sort, ascend, takeLast, chain, allPass, propEq, propSatisfies, not, pathOr, last, filter, has, prop, compose, map, concat, reduce, curry, contains, keys } from 'ramda'
import { symbolToPairArr } from 'shared/lib/helpers'

import { AsksState } from 'shared/reducers/asks'
import { BidsState } from 'shared/reducers/bids'
import { CandlesState } from 'shared/reducers/candles'
import { MACDState } from 'shared/reducers/macd'
import { OrdersState } from 'shared/reducers/orders'
import { PositionsState } from 'shared/reducers/positions'
import { RVIState } from 'shared/reducers/rvi'
import { StochState } from 'shared/reducers/stoch'
import { TickersState } from 'shared/reducers/tickers'
import { WalletState } from 'shared/reducers/wallet'

export type State = {
  asks: AsksState,
  bids: BidsState,
  candles: CandlesState,
  macd: MACDState,
  orders: OrdersState,
  positions: PositionsState,
  rvi: RVIState,
  stoch: StochState,
  tickers: TickersState,
  wallet: WalletState,
}

export const selectActivePositions = ({ positions }: State, symbol: string) =>
  chain(
    curry((ids: number[]) =>
      filter(allPass([
        propEq('symbol', symbol),
        propSatisfies(not, 'covered'),
        propSatisfies(compose(not, contains(__, ids)), 'id')
      ])
    )),
    compose(
      reduce(concat, []),
      map(prop('covered')),
      filter(has('covered')))
  )(positions)

const objKeysOfKey = (obj: { [key: string]: any }, key: string) => Object.keys((obj && obj[key]) || {}).sort((a, b) => Number(a) - Number(b))
const tailOfArray = (arr: any[], limit: number) => arr.slice(arr.length - 1 - limit, arr.length)
const headOfArray = (arr: any[], limit: number) => arr.slice(0, limit - 1)

export const selectCandles = ({ candles }: State, key: string, num: number) =>
  tailOfArray(objKeysOfKey(candles, key), num).map(mts => Number(mts)).map(mts => [ mts, ...candles[key][mts] ])

export const selectLowestLow = ({ candles }: State, key: string, num: number) =>
  tailOfArray(objKeysOfKey(candles, key), num).map(id => candles[key][Number(id)][3]).reduce((a, b) => b < a ? b : a)

export const selectHighestHigh = ({ candles }: State, key: string, num: number) =>
  tailOfArray(objKeysOfKey(candles, key), num).map(id => candles[key][Number(id)][2]).reduce((a, b) => b > a ? b : a)

// export const selectTickerBySymbol = ({ tickers }: State, symbol: string) =>
//   tickers[symbol]

export const selectCurrentPrice = ({ tickers }: State, symbol: string) =>
  tickers[symbol][6]

export const selectHighestBids = ({ bids }: State) => {
  const prices = Object.keys(bids).sort((a, b) => Number(b) - Number(a))
  return [ bids[prices[0]] || [], bids[prices[1]] || [] ]
}

export const selectHighestBid = ({ bids }: State) =>
  chain(prop, compose(head, sort(reverse), keys))(bids)

export const selectLowestAsk = ({ bids }: State) =>
  chain(prop, compose(head, keys))(bids)

export const selectMeansToBuy = ({ wallet }: State, symbol: string) =>
  path([ 'exchange', nth(2)(defaultTo([], symbolToPairArr(symbol))), 'balance' ])(wallet)

export const selectMeansToSell = ({ wallet }: State, symbol: string) =>
  path([ 'exchange', nth(1)(defaultTo([], symbolToPairArr(symbol))), 'balance' ])(wallet)

export const selectLowestAsks = ({ asks }: State) => {
  const prices = Object.keys(asks).sort((a, b) => Number(a) - Number(b))
  return [ asks[prices[0]] || [], asks[prices[1]] || [] ]
}

export const selectAmountToBuy = ({ wallet }: State, symbol: string) => {
  const matches = symbolToPairArr(symbol)
  return matches && wallet.exchange ? wallet.exchange[matches[2]].balance : 0
}

export const selectAmountToSell = ({ wallet }: State, symbol: string) => {
  const matches = symbolToPairArr(symbol)
  return matches && wallet.exchange ? wallet.exchange[matches[1]].balance : 0
}

const getArrayPartOfObj =
  curry((symbol: string, length: number) =>
    compose(takeLast(length), pathOr([], [ symbol ])))

export const selectLastMACDResults = ({ macd }: State, symbol: string, length: number) =>
  getArrayPartOfObj(symbol)(length)(macd)

export const selectLastRVIResults = ({ rvi }: State, symbol: string, length: number) =>
  getArrayPartOfObj(symbol)(length)(rvi)

export const selectLastStochasticResults = ({ stoch }: State, symbol: string, length: number) =>
  getArrayPartOfObj(symbol)(length)(stoch)
