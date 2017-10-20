type PivotPoints = {
  pivot: number,
  support: [ number, number ],
  resistance: [ number, number ]
}
type PivotsConclusionResult = {
  isAbovePivot: boolean,
  isBelowPivot: boolean,
  isUnderFirstSupport: boolean,
  isUnderSecondSupport: boolean,
  isUpwardFirstResistance: boolean,
  isUpwardSecondResistance: boolean
}

export const getPivotPoints = (closePrice: number, lowestLow: number, highestHigh: number): PivotPoints => {
  const pivotPoint = (highestHigh + lowestLow + closePrice) / 3
  const lowPivot1 = pivotPoint - (highestHigh - pivotPoint)
  const lowPivot2 = pivotPoint - (2 * (highestHigh - pivotPoint))
  const highPivot1 = pivotPoint + (pivotPoint - lowestLow)
  const highPivot2 = pivotPoint + (2 * (pivotPoint - lowestLow))

  // const lowPivot = lowPivot1 < closePrice ? lowPivot2 : lowPivot1
  // const highPivot = highPivot1 < closePrice ? highPivot2 : highPivot1 // (???)

  return {
    pivot: pivotPoint,
    support: [ lowPivot1, lowPivot2 ],
    resistance: [ highPivot1, highPivot2 ]
  }
}

export const pivotsConclusion = (close: number, pivotPoints: PivotPoints): PivotsConclusionResult =>
  ({
    isAbovePivot: close > pivotPoints.pivot,
    isBelowPivot: close < pivotPoints.pivot,
    isUnderFirstSupport: close < pivotPoints.support[0],
    isUnderSecondSupport: close < pivotPoints.support[1],
    isUpwardFirstResistance: close > pivotPoints.resistance[0],
    isUpwardSecondResistance: close > pivotPoints.resistance[1],
  })
