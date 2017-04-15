import test from 'ava'
import { transactions } from 'shared/reducers/transactions'
import { buySuccess, sellSuccess, addChunks, removeChunk, buyFailure, replaceChunksAmount } from 'shared/actions'

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

test.skip('transactions < buyFailure should work correctly', t => {
  const state = { foo: { rate: 0.5, amount: 1, active: true }, bar: {} }
  const action = buyFailure({ id: 'foo', error: 'Server error' })
  const newState = transactions(state, action)

  t.deepEqual(newState, { foo: { rate: 0.5, amount: 1, active: false, error: 'Server error' }, bar: {} })
})

test('transactions < replaceChunksAmount should replace correct amounts', t => {
  const state = {
    foo: { rate: 0.5, amount: 0.1, active: true },
    bar: { rate: 0.5, amount: 0.5, active: true },
    quz: { rate: 0.5, amount: 0.1, active: true }
  }
  const expected = {
    foo: { rate: 0.5, amount: 1, active: true },
    bar: { rate: 0.5, amount: 0.5, active: true },
    quz: { rate: 0.5, amount: 1, active: true }
  }
  const action = replaceChunksAmount({ from: 0.1, to: 1 })
  const newState = transactions(state, action)
  console.log({ newState })
  t.deepEqual(newState, expected)
})
