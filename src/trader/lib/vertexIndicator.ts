import { CandleData } from 'shared/types'

export default (candles: CandleData[]) => {
  const res = candles
    .map((v, i, a) => {
      if (a.length === i + 1) return
      const [ pMts, pOpen, pClose, pHight, pLow ] = a[i]
      const [ cMts, cOpen, cClose, cHight, cLow ] = a[i + 1]

      const trueRange = Math.max(pHight - cLow, cLow - pClose, cHight - pClose)
      const vmUp = cHight - pLow
      const vmDn = cLow - pHight

      return [ trueRange, vmUp, vmDn ]
    })
    .slice(0, -1)
    .reduce((p: number[], c: number[]) => [ p[0] + c[0], p[1] + c[1], p[2] + c[2] ])

  const [ trueRangeSum, vmUpSum, vmDnSum ] = <Array<number>>res
  const VIup = vmUpSum / trueRangeSum
  const VIdn = vmDnSum / trueRangeSum

  return [ VIup, VIdn ]
}
