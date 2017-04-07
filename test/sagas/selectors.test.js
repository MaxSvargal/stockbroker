import test from 'ava'
import * as selectors from 'server/sagas/selectors'

test('selectBuyForCover should select maximum rate and maximum amount', t => {
  const state = {
    transactions: {
      foo: { rate: 0.49, amount: 0.01, active: true, type: 'buy' },
      bar: { rate: 0.48, amount: 0.02, active: true, type: 'buy' },
      baz: { rate: 0.47, amount: 0.03, active: true, type: 'buy' },
      qux: { rate: 0.46, amount: 0.04, active: true, type: 'buy' }
    }
  }
  const output = selectors.selectBuyForCover(state, 0.46)
  t.is(output, 'foo')
})

test('selectBuyForCover should return false when no matches', t => {
  const state = {
    transactions: {
      foo: { rate: 0.49, amount: 0.01, active: true, type: 'buy' },
      bar: { rate: 0.48, amount: 0.02, active: true, type: 'buy' }
    }
  }
  const output = selectors.selectBuyForCover(state, 0.50)
  t.is(output, false)
})

test('selectSellForCover should select minimum rate and maximum amount', t => {
  const state = {
    transactions: {
      foo: { rate: 0.47, amount: 0.01, active: true, type: 'sell' },
      bar: { rate: 0.46, amount: 0.01, active: true, type: 'sell' },
      baz: { rate: 0.45, amount: 0.02, active: true, type: 'sell' },
      qux: { rate: 0.44, amount: 0.01, active: true, type: 'sell' }
    }
  }
  const output = selectors.selectSellForCover(state, 0.46)
  t.is(output, 'baz')
})


test('selectSellForCover should return false when no matches', t => {
  const state = {
    transactions: {
      foo: { rate: 0.47, amount: 0.01, active: true, type: 'sell' },
      bar: { rate: 0.46, amount: 0.01, active: true, type: 'sell' }
    }
  }
  const output = selectors.selectSellForCover(state, 0.46)
  t.is(output, false)
})
