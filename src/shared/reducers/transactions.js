import { createReducer } from 'redux-act'
import shortid from 'shortid'
import { buySuccess, buyFailure, sellSuccess, sellFailure, addChunks, removeChunk, replaceChunksAmount } from '../actions'
import { time } from './helpers'

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
      [coverId]: Object.assign({},
        state[Object.keys(state).find(k => k === coverId)],
        { orderNumber, profit, updated: time(), active: false })
    }
    const newBuy = {
      [shortid.generate()]: {
        rate, amount, coverId, created: time(), type: 'buy', active: true, creationMethod: 'cover'
      }
    }
    return Object.assign({}, state, coveredSell, newBuy)
  },

  [sellSuccess]: (state, { rate, amount, profit, coverId, orderNumber }) => {
    const coveredBuy = {
      [coverId]: Object.assign({},
        state[Object.keys(state).find(k => k === coverId)],
        { orderNumber, profit, updated: time(), active: false })
    }
    const newSell = {
      [shortid.generate()]: {
        rate, amount, coverId, created: time(), type: 'sell', active: true, creationMethod: 'cover'
      }
    }
    return Object.assign({}, state, coveredBuy, newSell)
  },

  [buyFailure]: (state, { rate, amount, coverId, error }) =>
    Object.assign({}, state, {
      [shortid.generate()]:
        Object.assign({}, { rate, amount, coverId, error, created: time(), type: 'buy', active: false })
    }),

  [sellFailure]: (state, { rate, amount, coverId, error }) =>
    Object.assign({}, state, {
      [shortid.generate()]:
        Object.assign({}, { rate, amount, coverId, error, created: time(), type: 'sell', active: false })
    }),

  [addChunks]: (state, { type, num, rate, amount, creationMethod = 'manual' }) =>
    Object.assign({},
      state,
      [ ...new Array(num) ]
        .map(() => ({ [shortid.generate()]: {
          rate, amount, type, creationMethod, created: time(), active: true
        } }))
        .reduce((prev, curr) => Object.assign({}, prev, curr), {})),

  [removeChunk]: (state, id) =>
    Object.assign({}, state, {
      [id]: Object.assign({}, state[id], { updated: time(), active: false, removed: true }) }),

  [replaceChunksAmount]: (state, { from, to }) => {
    const closedChunks = Object.keys(state)
      .filter(key => state[key].active === true && state[key].amount === from)
      .reduce((obj, key) => Object.assign({}, obj, {
        [key]: Object.assign({}, state[key], { updated: time(), active: false, removed: true })
      }), {})

    const newChunks = Object.keys(closedChunks)
      .reduce((obj, key) => Object.assign({}, obj, {
        [shortid.generate()]: Object.assign({}, state[key], {
          amount: to, created: time(), active: true
        })
      }), {})

    return Object.assign({}, state, closedChunks, newChunks)
  }
}, {})
