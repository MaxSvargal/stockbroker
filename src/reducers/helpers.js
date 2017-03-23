export const time = val => val ? new Date(val).getTime() : new Date().getTime()

export const removeIndex = (arr, index) => index === -1 ? arr :
  [ ...arr.slice(0, index), ...arr.slice(index + 1) ]

export const mergeOnAmount = (state, rate, amount) =>
  amount ?
    [ ...state, [ time(), rate, amount ] ] :
    [ ...state.slice(0, -1), [ time(), rate, state[state.length - 1][1] ] ]

export const getOnlyLast = (arr, minutes) => {
  const currTime = time()
  return arr.reduce((prev, curr) =>
    currTime - curr[0] < minutes ? [ ...prev, curr ] : prev, [])
}
