import { createSelector } from 'reselect'
import { CandlesState } from 'shared/reducers/candles'
import { TickersState } from 'shared/reducers/tickers'

type State = {
  candles: CandlesState,
  tickers: TickersState
}

const objKeysOfKey = (obj: { [key: string]: any }, key: string) => Object.keys((obj && obj[key]) || {}).sort((a, b) => Number(b) - Number(a))
const tailOfArray = (arr: any[], limit: number) => arr.slice(arr.length - 1 - limit, arr.length - 1)
const headOfArray = (arr: any[], limit: number) => arr.slice(0, limit - 1)

export const selectCandles = ({ candles }: State, key: string, num: number) =>
  headOfArray(objKeysOfKey(candles, key), num).map(mts => Number(mts)).map(mts => [ mts, ...candles[key][mts] ])

export const selectLowestLow = ({ candles }: State, key: string, num: number) =>
  headOfArray(objKeysOfKey(candles, key), num).map(id => candles[key][Number(id)][3]).reduce((a, b) => b < a ? b : a)

export const selectHighestHigh = ({ candles }: State, key: string, num: number) =>
  headOfArray(objKeysOfKey(candles, key), num).map(id => candles[key][Number(id)][2]).reduce((a, b) => b > a ? b : a)

export const selectTicker = ({ tickers }: State, pair: string) =>
  tickers[`t${pair}`]
