import { createReducer } from 'redux-act'
import { time } from 'reducers/helpers'
import { buySuccess, sellSuccess, addBuyChunks, addSellChunks, sellFailure, buyFailure, removeOpenSells, removeOpenBuys } from 'actions'

export const myBuys = createReducer({
  [buySuccess]: (state, [ rate, amount, coverIndex, orderNumber ]) => {
    const cover = (v, i) => i === coverIndex ? [ ...v.slice(0, 3), orderNumber, 1 ] : v
    const newEntity = [ time(), rate, amount, 0, 0 ]
    return [ ...state.map(cover), newEntity ]
  },
  [addBuyChunks]: (state, data) => [ ...state, ...data.map(v => [ time(), ...v, -1, 0 ]) ],
  [removeOpenBuys]: (state) => state.filter(v => v[4] !== 0)
}, [])

export const mySells = createReducer({
  [sellSuccess]: (state, [ rate, amount, coverIndex, orderNumber ]) => {
    const cover = (v, i) => i === coverIndex ? [ ...v.slice(0, 3), orderNumber, 1 ] : v
    const newEntity = [ time(), rate, amount, 0, 0 ]
    return [ ...state.map(cover), newEntity ]
  },
  [addSellChunks]: (state, data) => [ ...state, ...data.map(v => [ time(), ...v, -1, 0 ]) ],
  [removeOpenSells]: (state) => state.filter(v => v[4] !== 0)
}, [])

export const myFailureSells = createReducer({
  [sellFailure]: (state, data) => [ ...state, [ time(), ...data ] ]
}, [])

export const myFailureBuys = createReducer({
  [buyFailure]: (state, data) => [ ...state, [ time(), ...data ] ]
}, [])
