import test from 'ava'
import * as selectors from 'worker/sagas/selectors'

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

test('selectVolumeOfChunksType should return full amount of buy chunks', t => {
  const state = {
    transactions: {
      foo: { rate: 0.43, amount: 0.01, active: true, type: 'buy' },
      foz: { rate: 0.44, amount: 0.02, active: true, type: 'buy' },
      bar: { rate: 0.45, amount: 0.03, active: true, type: 'buy' },
      baz: { rate: 0.46, amount: 0.04, active: false, type: 'buy' },
      qux: { rate: 0.47, amount: 0.05, active: true, type: 'sell' }
    }
  }
  const output = selectors.selectVolumeOfChunksType(state, 'buy')
  t.deepEqual(output, 0.06)
})

test('selectVolumeOfChunksType should return full amount of sell chunks', t => {
  const state = {
    transactions: {
      foo: { rate: 0.43, amount: 0.01, active: true, type: 'sell' },
      foz: { rate: 0.44, amount: 0.02, active: true, type: 'sell' },
      bar: { rate: 0.45, amount: 0.03, active: true, type: 'sell' },
      baz: { rate: 0.46, amount: 0.04, active: false, type: 'sell' },
      qux: { rate: 0.47, amount: 0.05, active: true, type: 'buy' }
    }
  }
  const output = selectors.selectVolumeOfChunksType(state, 'sell')
  t.deepEqual(output, 0.06)
})

test('selectBuysDuringTime should select correct buys', t => {
  const state = {
    buy: [
      [ 1493396698456 - (1000 * 60 * 7), 0.012, 1 ],
      [ 1493396698456 - (1000 * 60 * 6), 0.013, 1 ],
      [ 1493396698457, 0.012, 1 ],
      [ 1493396762820, 0.011, 2 ],
      [ 1493396768338, 0.012, 1 ],
    ]
  }
  const output = selectors.selectBuysDuringTime(state, 1493396698456)
  t.deepEqual(output, [
    [ 1493396698457, 0.012, 1 ],
    [ 1493396762820, 0.011, 2 ],
    [ 1493396768338, 0.012, 1 ]
  ])
})

test('selectSellsDuringTime should select correct buys', t => {
  const state = {
    sell: [
      [ 1493396698456 - (1000 * 60 * 7), 0.012, 1 ],
      [ 1493396698456 - (1000 * 60 * 6), 0.013, 1 ],
      [ 1493396698457, 0.012, 1 ],
      [ 1493396762820, 0.011, 2 ],
      [ 1493396768338, 0.012, 1 ],
    ]
  }
  const output = selectors.selectSellsDuringTime(state, 1493396698456)
  t.deepEqual(output, [
    [ 1493396698457, 0.012, 1 ],
    [ 1493396762820, 0.011, 2 ],
    [ 1493396768338, 0.012, 1 ]
  ])
})

test('selectStatsDuringTime should select correct stats', t => {
  const state = {
    stats: [
      { created: 1493396698456 - (1000 * 60 * 66) },
      { created: 1493396698456 - (1000 * 60 * 61) },
      { created: 1493396698456 },
      { created: 1493396698456 + (1000 * 60 * 5) },
    ]
  }
  const output = selectors.selectStatsDuringTime(state, 1493396698455)
  t.deepEqual(output, [
    { created: 1493396698456 },
    { created: 1493396698456 + (1000 * 60 * 5) }
  ])
})
