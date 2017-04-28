import { createReducer } from 'redux-act'
import shortid from 'shortid'
import { buySuccess, buyFailure, sellSuccess, sellFailure, addChunks, removeChunk, replaceChunksAmount } from '../actions'
import { now, assign } from './helpers'

/**
 * @type {boolean} active
 * @type {boolean} removed
 * @type {number} amount
 * @type {number} created
 * @type {string} creationMethod
 * @type {number} orderNumber
 * @type {number} profit
 * @type {number} rate
 * @type {number} updated
 * @type {string} coverId
 * @type {string} error
*/

/* eslint import/prefer-default-export: 0 */
export const transactions = createReducer({
  [buySuccess]: (state, { rate, amount, profit, coverId, orderNumber }) => {
    const coveredSell = {
      [coverId]: assign(
        state[Object.keys(state).find(k => k === coverId)],
        { orderNumber, profit, updated: now(), active: false })
    }
    const newBuy = {
      [shortid.generate()]: {
        rate, amount, coverId, created: now(), type: 'buy', active: true, creationMethod: 'cover'
      }
    }
    return assign(state, coveredSell, newBuy)
  },

  [sellSuccess]: (state, { rate, amount, profit, coverId, orderNumber }) => {
    const coveredBuy = {
      [coverId]: assign(
        state[Object.keys(state).find(k => k === coverId)],
        { orderNumber, profit, updated: now(), active: false })
    }
    const newSell = {
      [shortid.generate()]: {
        rate, amount, coverId, created: now(), type: 'sell', active: true, creationMethod: 'cover'
      }
    }
    return assign(state, coveredBuy, newSell)
  },

  [buyFailure]: (state, { rate, amount, coverId, error }) =>
    assign(state, {
      [shortid.generate()]:
        assign({ rate, amount, coverId, error, created: now(), type: 'buy', active: false })
    }),

  [sellFailure]: (state, { rate, amount, coverId, error }) =>
    assign(state, {
      [shortid.generate()]:
        assign({ rate, amount, coverId, error, created: now(), type: 'sell', active: false })
    }),

  [addChunks]: (state, { type, num, rate, amount, creationMethod = 'manual' }) =>
    assign(state,
      [ ...new Array(num) ]
        .map(() => ({ [shortid.generate()]: {
          rate, amount, type, creationMethod, created: now(), active: true
        } }))
        .reduce((prev, curr) => assign(prev, curr), {})),

  [removeChunk]: (state, id) =>
    assign(state, {
      [id]: assign(state[id], { updated: now(), active: false, removed: true }) }),

  [replaceChunksAmount]: (state, { from, to }) => {
    const closedChunks = Object.keys(state)
      .filter(key => state[key].active === true && state[key].amount === from)
      .reduce((obj, key) => assign(obj, {
        [key]: assign(state[key], { updated: now(), active: false, removed: true })
      }), {})

    const newChunks = Object.keys(closedChunks)
      .reduce((obj, key) => assign(obj, {
        [shortid.generate()]: assign(state[key], { amount: to, created: now(), active: true })
      }), {})

    return assign(state, closedChunks, newChunks)
  }
}, {})
