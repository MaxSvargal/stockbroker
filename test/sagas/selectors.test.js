import test from 'ava'
import * as selectors from 'server/sagas/selectors'

test('selectBuyForCover should select manimum rate and maximum amount', t => {
  const state = {
    transactions: {
      foo: { rate: 0.47, amount: 0.01, active: true, type: 'buy', creationMethod: 'manual' },
      bar: { rate: 0.46, amount: 0.02, active: true, type: 'buy', creationMethod: 'manual' },
      baz: { rate: 0.45, amount: 0.03, active: true, type: 'buy', creationMethod: 'manual' },
      qux: { rate: 0.44, amount: 0.04, active: true, type: 'buy', creationMethod: 'hollow' }
    }
  }
  const output = selectors.selectBuyForCover(state, 0.46)
  t.is(output, 'baz')
})

test('selectBuyForCover should return false when no matches', t => {
  const state = {
    transactions: {
      foo: { rate: 0.52, amount: 0.01, active: true, type: 'buy' },
      bar: { rate: 0.51, amount: 0.02, active: true, type: 'buy' }
    }
  }
  const output = selectors.selectBuyForCover(state, 0.50)
  t.is(output, false)
})

test('selectSellForCover should select minimum rate and maximum amount', t => {
  const state = {
    transactions: {
      foo: { rate: 0.47, amount: 0.01, active: true, type: 'sell', creationMethod: 'hollow' },
      foz: { rate: 0.465, amount: 0.01, active: true, type: 'sell', creationMethod: 'manual' },
      bar: { rate: 0.464, amount: 0.02, active: true, type: 'sell', creationMethod: 'manual' },
      baz: { rate: 0.461, amount: 0.01, active: true, type: 'sell', creationMethod: 'hollow' },
      qux: { rate: 0.45, amount: 0.01, active: true, type: 'sell', creationMethod: 'manual' }
    }
  }
  const output = selectors.selectSellForCover(state, 0.46)
  t.is(output, 'bar')
})


test('selectSellForCover should return false when no matches', t => {
  const state = {
    transactions: {
      foo: { rate: 0.44, amount: 0.01, active: true, type: 'sell' },
      bar: { rate: 0.45, amount: 0.01, active: true, type: 'sell' }
    }
  }
  const output = selectors.selectSellForCover(state, 0.46)
  t.is(output, false)
})

test('selectObsoleteTransactions should work correctly', t => {
  const state = {
    obsoleteThreshold: 0.011,
    transactions: {
      foo: { rate: 0.43, amount: 0.01, active: true, creationMethod: 'hollow' },
      foz: { rate: 0.44, amount: 0.01, active: true, creationMethod: 'hollow' },
      bar: { rate: 0.45, amount: 0.02, active: true, creationMethod: 'hollow' },
      baz: { rate: 0.46, amount: 0.01, active: true, creationMethod: 'hollow' },
      qux: { rate: 0.47, amount: 0.01, active: true, creationMethod: 'hollow' }
    }
  }
  const output = selectors.selectObsoleteTransactions(state, 0.45)
  t.deepEqual(output, [ 'foo', 'qux' ])
})
