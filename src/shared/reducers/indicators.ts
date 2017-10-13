import { combineReducers } from 'redux'
import { createReducer } from 'redux-act'
import { addStochasticResult, addMACDResult } from 'shared/actions'
import { TickerData } from 'shared/types'

export type IndicatorsState = {
  stochastic: number[],
  macd: number[]
}

const stochastic = createReducer<IndicatorsState['stochastic']>({}, [])
const macd = createReducer<IndicatorsState['macd']>({}, [])

stochastic.on(addStochasticResult, (state, value) =>
  state.slice(-1)[0] !== value ? [ ...state, value ] : state)

macd.on(addMACDResult, (state, value) =>
  state.slice(-1)[0] !== value ? [ ...state, value ] : state)

export default combineReducers({ stochastic, macd })
