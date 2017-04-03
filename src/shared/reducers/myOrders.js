/* eslint no-unused-vars: 0 */
import { createReducer } from 'redux-act'
import { time } from './helpers'
import { buySuccess, sellSuccess, addBuyChunks, addSellChunks, sellFailure, buyFailure, removeOpenSells, removeOpenBuys } from '../actions'

export const myBuys = createReducer({
  [buySuccess]: (state, [ rate, amount, coverIndex, orderNumber ]) =>
    [ ...state, [ time(), rate, amount, 0, 0 ] ],

  [sellSuccess]: (state, [ rate, amount, coverIndex, orderNumber ]) => [
    ...state
      .filter(v => v[4] === 0)
      .map((v, i) => i === coverIndex ? [ ...v.slice(0, 3), orderNumber, 1 ] : v),
    ...state.filter(v => v[4] !== 0)
  ].sort(),

  [addBuyChunks]: (state, data) => [ ...state, ...data.map(v => [ time(), ...v, -1, 0 ]) ],
  [removeOpenBuys]: (state) => state.filter(v => v[4] !== 0)
}, [])

// TODO: хранить транзакции в виде объектов с уникальными id
export const mySells = createReducer({
  [sellSuccess]: (state, [ rate, amount, coverIndex, orderNumber ]) =>
    [ ...state, [ time(), rate, amount, 0, 0 ] ],

  [buySuccess]: (state, [ rate, amount, coverIndex, orderNumber ]) => [
    ...state
      .filter(v => v[4] === 0)
      .map((v, i) => i === coverIndex ? [ ...v.slice(0, 3), orderNumber, 1 ] : v),
    ...state.filter(v => v[4] !== 0)
  ].sort(),

  [addSellChunks]: (state, data) => [ ...state, ...data.map(v => [ time(), ...v, -1, 0 ]) ],
  [removeOpenSells]: (state) => state.filter(v => v[4] !== 0)
}, [])

export const myFailureSells = createReducer({
  [sellFailure]: (state, data) => [ ...state, [ time(), ...data ] ]
}, [])

export const myFailureBuys = createReducer({
  [buyFailure]: (state, data) => [ ...state, [ time(), ...data ] ]
}, [])
