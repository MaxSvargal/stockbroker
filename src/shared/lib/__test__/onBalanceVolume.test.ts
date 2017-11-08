import onBalanceVolume from '../onBalanceVolume'

test('onBalanceVolume shpult work correctly', () => {
  const pricesAndVolumes = <[number, number][]>[
    [ 11, 50 ], [ 12, 50 ], [ 13, 55 ], [ 12, 75 ]
  ]
  expect(onBalanceVolume(pricesAndVolumes)).toEqual([50, 100, 155, 80])
  // check trand
  // trend matches
  // potential support or resistance levels
  // Once broken, the trend for OBV will change and these breaks can be used to generate signals.
})

// Pivot Point = (High + Low + Close) / 3
// #1 high pivot = Pivot Point + (Pivot Point - Low)
// #1 low pivot = Pivot Point - (High - Pivot Point)
// #2 high pivot = Pivot Point + 2 (Pivot Point - Low)
// #2 low pivot = Pivot Point - 2 (High - Pivot Point)
// #3 high pivot = High + 2 (Pivot Point - Low)
// #3 low pivot = Low - 2 (High - Pivot Point)
// I'll look at the #1 low for support and the #2 high for resistance.
// I have noticed that the #1 pivots work the best over time.
// If the market gaps over the #1 pivot high, you'll have a #2 and #3 to work with.
