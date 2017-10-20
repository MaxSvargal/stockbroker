export const OBV =
  (prevOBV: number, currVolume: number, prevClosePrice: number, currentClosePrice: number) =>
    prevClosePrice < currentClosePrice ?
      prevOBV + currVolume :
        prevClosePrice > currentClosePrice ?
          prevOBV - currVolume :
          prevOBV

const onBalanceVolume = (pricesAndVolumes: [ number, number][]): number[] => {
  return pricesAndVolumes.reduce(
    ([ prevOBVs, [ prevPrice, prevVolume ] ]: [ number[], [ number, number ] ], [ currPrice, currVolume ]) =>
      [ [ ...prevOBVs, OBV(prevOBVs[prevOBVs.length - 1], currVolume, prevPrice, currPrice) ], [ currPrice, currVolume ] ],
      [ [ pricesAndVolumes[0][1] ], pricesAndVolumes[0] ])[0].slice(1)
}

export default onBalanceVolume
