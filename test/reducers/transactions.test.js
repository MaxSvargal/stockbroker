import test from 'ava'
import { transactions } from 'shared/reducers/transactions'
import { buySuccess, sellSuccess, addChunks, removeChunk, buyFailure, replaceChunksAmount, cleanChunksType } from 'shared/actions'

test.skip('transactions < buySuccess should work correctly', t => {
  const data = { orderNumber: 987, rate: 0.5, coverId: 'rkg' }
  const state = transactions({}, buySuccess(data))
  const item = state[Object.keys(state)[0]]

  t.is(item.rate, data.rate)
  t.is(item.orderNumber, data.orderNumber)
})

test.skip('transactions < sellSuccess should work correctly', t => {
  const state = { rkg: { rate: 0.5, amount: 1, orderNumber: 0, active: true } }
  const action = sellSuccess({ coverId: 'rkg', orderNumber: 987 })
  const newState = transactions(state, action)

  t.deepEqual(newState.rkg, { rate: 0.5, amount: 1, orderNumber: 987, active: false })
})

test('transactions < addBuyChunks should work correctly', t => {
  const data = { num: 3, rate: 0.45, amount: 0.01, type: 'buy' }
  const action = addChunks(data)
  const newState = transactions({}, action)
  const keys = Object.keys(newState)

  t.is(newState[keys[0]].rate, data.rate)
  t.is(newState[keys[0]].amount, data.amount)
  t.is(newState[keys[1]].rate, data.rate)
  t.is(newState[keys[1]].amount, data.amount)
  t.is(newState[keys[2]].rate, data.rate)
  t.is(newState[keys[2]].amount, data.amount)
})

test.skip('transactions < removeBuyChunk should work correctly', t => {
  const state = { foo: { rate: 0.5, amount: 1 }, bar: {} }
  const action = removeChunk('foo')
  const newState = transactions(state, action)

  t.deepEqual(newState, { foo: { rate: 0.5, amount: 1, removed: true }, bar: {} })
})

test('transactions < buyFailure should work correctly', t => {
  const state = { foo: {}, bar: {} }
  const action = buyFailure({ rate: 0.5, amount: 0.1, coverId: 'foo', error: 'Server error' })
  const newState = transactions(state, action)
  const key = Object.keys(newState)[2]
  t.is(newState[key].coverId, 'foo')
  t.is(newState[key].error, 'Server error')
  t.is(newState[key].type, 'buy')
})

test('transactions < replaceChunksAmount should remove old and create new chunks with passed amount', t => {
  const state = {
    foo: { rate: 0.5, amount: 0.1, active: true },
    bar: { rate: 0.5, amount: 0.5, active: true },
    quz: { rate: 0.5, amount: 0.1, active: true }
  }
  const action = replaceChunksAmount({ from: 0.1, to: 1 })
  const newState = transactions(state, action)
  const keys = Object.keys(newState)

  t.is(Object.keys(newState).length, 5)
  t.is(newState[keys[0]].active, false)
  t.is(newState[keys[1]].active, true)
  t.is(newState[keys[2]].active, false)
  t.is(newState[keys[3]].active, true)
  t.is(newState[keys[3]].amount, 1)
  t.is(newState[keys[4]].active, true)
  t.is(newState[keys[4]].amount, 1)
})

test('transactions < cleanChunksType should remove all chunks of passed type', t => {
  const state = {
    foo: { rate: 0.5, amount: 0.1, active: true, type: 'sell' },
    bar: { rate: 0.5, amount: 0.5, active: true, type: 'buy' },
    quz: { rate: 0.5, amount: 0.1, active: false, type: 'buy' }
  }
  const expected = {
    foo: { rate: 0.5, amount: 0.1, active: true, type: 'sell' },
    bar: { rate: 0.5, amount: 0.5, active: false, type: 'buy' },
    quz: { rate: 0.5, amount: 0.1, active: false, type: 'buy' }
  }
  const action = cleanChunksType('buy')
  const newState = transactions(state, action)

  t.deepEqual(newState, expected)
})
