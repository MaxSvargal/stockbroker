import { createReducer } from 'redux-act'
import { merge, objOf, compose, reduce, nth, tail, converge, pick, prop, assoc, apply, zipObj, map } from 'ramda'
import { setCandles, updateCandle } from 'shared/actions'
import { MTS, OPEN, CLOSE, HIGHT, LOW, VOLUME } from 'shared/types'

export type CandlesState = {
  [key: string]: {
    [mts: number]: [ OPEN, CLOSE, HIGHT, LOW, VOLUME ]
  }
}

const candlesReducer = createReducer({}, <CandlesState>{})
const transformRawToObj = converge(zipObj, [ map(nth(0)), map(tail) ])

candlesReducer.on(setCandles, (state, [ key, data ]) =>
  assoc(key, transformRawToObj(data), state))

candlesReducer.on(updateCandle, (state, [ key, data ]) =>
  assoc(key, merge(prop(key, state), transformRawToObj([ data ])), state))

export default candlesReducer
