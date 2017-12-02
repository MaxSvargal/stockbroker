import RSI from './rsi'

test('RSI', () => {
  // [ MTS, OPEN, CLOSE, HIGHT, LOW, VOLUME ]
  const data = [
    [ 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 2, 0, 0, 0 ],
    [ 0, 0, 1, 0, 0, 0 ],
    [ 0, 0, 3, 0, 0, 0 ],
    [ 0, 0, 4, 0, 0, 0 ],
    [ 0, 0, 3, 0, 0, 0 ],
    [ 0, 0, 3, 0, 0, 0 ]
  ]

  expect(RSI(data)).toEqual(64.37744618395303)
})
