import { symbolToPairArr } from 'shared/lib/helpers'

import { AsksState } from 'shared/reducers/asks'
import { BidsState } from 'shared/reducers/bids'
import { CandlesState } from 'shared/reducers/candles'
import { MACDState } from 'shared/reducers/macd'
import { OrdersState } from 'shared/reducers/orders'
import { TickersState } from 'shared/reducers/tickers'
import { WalletState } from 'shared/reducers/wallet'

export type State = {
  asks: AsksState,
  bids: BidsState,
  candles: CandlesState,
  macd: MACDState,
  orders: OrdersState,
  tickers: TickersState,
  wallet: WalletState,
}

const objKeysOfKey = (obj: { [key: string]: any }, key: string) => Object.keys((obj && obj[key]) || {}).sort((a, b) => Number(a) - Number(b))
const tailOfArray = (arr: any[], limit: number) => arr.slice(arr.length - 1 - limit, arr.length)
const headOfArray = (arr: any[], limit: number) => arr.slice(0, limit - 1)

export const selectCandles = ({ candles }: State, key: string, num: number) =>
  tailOfArray(objKeysOfKey(candles, key), num).map(mts => Number(mts)).map(mts => [ mts, ...candles[key][mts] ])

export const selectLowestLow = ({ candles }: State, key: string, num: number) =>
  tailOfArray(objKeysOfKey(candles, key), num).map(id => candles[key][Number(id)][3]).reduce((a, b) => b < a ? b : a)

export const selectHighestHigh = ({ candles }: State, key: string, num: number) =>
  tailOfArray(objKeysOfKey(candles, key), num).map(id => candles[key][Number(id)][2]).reduce((a, b) => b > a ? b : a)

export const selectTickerBySymbol = ({ tickers }: State, symbol: string) =>
  tickers[symbol]

export const selectCurrentPrice = ({ tickers }: State, symbol: string) =>
  tickers[symbol][6]

export const selectHighestBids = ({ bids }: State) => {
  const prices = Object.keys(bids).sort((a, b) => Number(b) - Number(a))
  return [ bids[prices[0]] || [], bids[prices[1]] || [] ]
}

export const selectLowestAsks = ({ asks }: State) => {
  const prices = Object.keys(asks).sort((a, b) => Number(a) - Number(b))
  return [ asks[prices[0]] || [], asks[prices[1]] || [] ]
}

export const selectLastBuy = ({ orders }: State, symbol: string, ) =>
  orders

// export const selectActiveOrder = ({ orders }: State, symbol: string, type: 'buy' | 'sell') => {
//   const activeOrder = Object.keys(orders).find(a => {
//     const o = orders[a]
//     return o[3] === symbol && o[13] === 'ACTIVE' && (type === 'buy' ? o[6] > 0 : o[6] < 0)
//   })
//   return activeOrder ? orders[activeOrder] : null
// }

export const selectAmountToBuy = ({ wallet }: State, symbol: string) => {
  const matches = symbolToPairArr(symbol)
  return matches ? wallet.exchange[matches[2]].balance : null
}

export const selectAmountToSell = ({ wallet }: State, symbol: string) => {
  const matches = symbolToPairArr(symbol)
  return matches ? wallet.exchange[matches[1]].balance : null
}
//
// export const selectCurrentBidPrice = ({ tickers }: State, symbol: string) =>
//   tickers[symbol][0]
//
// export const selectTradePositionState = ({ tradePositions }: State, symbol: string) =>
//   tradePositions[symbol]

export const selectMACDResults = ({ macd }: State, symbol: string, length: number) =>
  macd[symbol].slice(-length)
