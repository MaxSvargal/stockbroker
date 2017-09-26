import { createReducer } from 'redux-act'
import { addTrade, setTrades, TradesPayload, MTS, AMOUNT, PRICE } from 'exchanger/actions'

type TradesState = {
  [pair: string]: {
    [id: number]: [ MTS, AMOUNT, PRICE ]
  }
}

const tradesReducer = createReducer<TradesState>({}, {})

tradesReducer.on(setTrades, (state, { pair, data }) => ({
  ...state,
  [pair]: {
    ...state[pair],
    ...data.reduce((prev, [ id, ...props ]) =>
      ({ ...prev, [id]: props }), {})
  }
}))

tradesReducer.on(addTrade, (state, { pair, data: [ id, mts, amount, price ] }) =>
  ({ ...state, [pair]: { ...state[pair], [id]: [ mts, amount, price ] } }))

export default tradesReducer
