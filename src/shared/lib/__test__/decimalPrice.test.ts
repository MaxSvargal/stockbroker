import DecimalPrice from '../decimalPrice'

test('DecimalPrice > substractIsMoreThenBit should work correctly', () => {
  const decimal1 = new DecimalPrice(1234.5)
  expect(decimal1.substractIsMoreThenBit(1234.3)).toEqual(true)
  expect(decimal1.substractIsMoreThenBit(1234.4)).toEqual(false)

  const decimal2 = new DecimalPrice(1.23)
  expect(decimal2.substractIsMoreThenBit(1.23)).toEqual(false)
  expect(decimal2.substractIsMoreThenBit(1.2301)).toEqual(false)
  expect(decimal2.substractIsMoreThenBit(1.2299)).toEqual(false)
  expect(decimal2.substractIsMoreThenBit(1.2298)).toEqual(true)
})

test('DecimalPrice > increaseBit should work correctly', () => {
  const decimal1 = new DecimalPrice(1234.5)
  expect(decimal1.increaseBit()).toEqual(1234.6)

  const decimal2 = new DecimalPrice(1.23)
  expect(decimal2.increaseBit()).toEqual(1.2301)

  const decimal3 = new DecimalPrice(1234.9)
  expect(decimal3.increaseBit()).toEqual(1235)

  const decimal4 = new DecimalPrice(12.999)
  expect(decimal4.increaseBit()).toEqual(13)
})

test('DecimalPrice > decreaseBit should work correctly', () => {
  const decimal1 = new DecimalPrice(1234.5)
  expect(decimal1.decreaseBit()).toEqual(1234.4)

  const decimal2 = new DecimalPrice(1234.1)
  expect(decimal2.decreaseBit()).toEqual(1234)

  const decimal3 = new DecimalPrice(1.23)
  expect(decimal3.decreaseBit()).toEqual(1.2299)

  const decimal4 = new DecimalPrice(1234.0)
  expect(decimal4.decreaseBit()).toEqual(1233.9)

  const decimal5 = new DecimalPrice(12.3)
  expect(decimal5.decreaseBit()).toEqual(12.299)

  const decimal6 = new DecimalPrice(1)
  expect(decimal6.decreaseBit()).toEqual(0.9999)

  const decimal7 = new DecimalPrice(0.999)
  expect(decimal7.decreaseBit()).toEqual(0.9989)
})
