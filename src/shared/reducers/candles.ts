import { createReducer } from 'redux-act'
import { setCandles, updateCandle } from 'exchanger/actions'
import { MTS, OPEN, CLOSE, HIGHT, LOW, VOLUME } from 'shared/types'

export type CandlesState = {
  [key: string]: {
    [mts: number]: [ OPEN, CLOSE, HIGHT, LOW, VOLUME ]
  }
}

const candlesReducer = createReducer({}, <CandlesState>{})
const checkCandleEquals = (a: number[], b: number[]): boolean =>
  a && b ? a.map((a, i) => a === b[i]).reduce((a, b) => a && b) : false

candlesReducer.on(setCandles, (state, { key, data }) =>
  ({ ...state, [key]: data.reduce((a, b) => ({ ...a, [b[0]]: b.slice(1, 6) }), {}) }))

candlesReducer.on(updateCandle, (state, { key, data: [ mts, open, close, hight, low, volume ] }) =>
  checkCandleEquals(state[key][mts], [ open, close, hight, low, volume ]) ? state :
    ({ ...state, [key]: { ...state[key], [mts]: [ open, close, hight, low, volume ] } }))

export default candlesReducer
