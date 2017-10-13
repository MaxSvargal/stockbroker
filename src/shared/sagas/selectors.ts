import { symbolToPairArr } from 'shared/lib/helpers'

import { CandlesState } from 'shared/reducers/candles'
import { OrderbookState } from 'shared/reducers/orderbook'
import { OrdersState } from 'shared/reducers/orders'
import { TickersState } from 'shared/reducers/tickers'
import { WalletState } from 'shared/reducers/wallet'
import { IndicatorsState } from 'shared/reducers/indicators'

export type State = {
  candles: CandlesState,
  orderbook: OrderbookState,
  orders: OrdersState,
  tickers: TickersState,
  wallet: WalletState
  indicators: IndicatorsState
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

export const selectTickerBySymbol = ({ tickers }: State, symbol: string) => tickers[symbol]

export const selectHighestBids = ({ orderbook: { bid } }: State) => {
  const prices = Object.keys(bid).sort((a, b) => Number(b) - Number(a))
  return [ bid[prices[0]], bid[prices[1]] ]
}

export const selectLowestAsks = ({ orderbook: { ask } }: State) => {
  const prices = Object.keys(ask).sort((a, b) => Number(a) - Number(b))
  return [ ask[prices[0]], ask[prices[1]] ]
}

// export const selectActiveOrder = ({ orders }: State, symbol: string, type: 'buy' | 'sell') => {
//   const activeOrder = Object.keys(orders).find(a => {
//     const o = orders[a]
//     return o[3] === symbol && o[13] === 'ACTIVE' && (type === 'buy' ? o[6] > 0 : o[6] < 0)
//   })
//   return activeOrder ? orders[activeOrder] : null
// }

export const selectAmountToBuy = ({ wallet }: State, symbol: string) => {
  const matches = symbolToPairArr(symbol)
  return matches ? wallet.exchange[matches[2]].balanceAvaliable : null
}

export const selectAmountToSell = ({ wallet }: State, symbol: string) => {
  const matches = symbolToPairArr(symbol)
  return matches ? wallet.exchange[matches[1]].balanceAvaliable : null
}
//
// export const selectCurrentBidPrice = ({ tickers }: State, symbol: string) =>
//   tickers[symbol][0]
//
// export const selectTradePositionState = ({ tradePositions }: State, symbol: string) =>
//   tradePositions[symbol]

export const selectStochasticResults = ({ indicators: { stochastic } }: State, length: number) =>
  stochastic.slice(-length)

export const selectMACDResults = ({ indicators: { macd } }: State, length: number) =>
  macd.slice(-length)
