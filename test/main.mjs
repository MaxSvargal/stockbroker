import sum from '../dist/main.mjs'

test('sum should work', () => {
  expect(sum(1, 2)).toBe(1)
})
