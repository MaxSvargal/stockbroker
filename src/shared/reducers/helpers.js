export const now = () => Date.now()

export const removeIndex = (arr, index) => index === -1 ? arr :
  [ ...arr.slice(0, index), ...arr.slice(index + 1) ]

export const mergeOnAmount = (state, rate, amount) =>
  amount ?
    [ ...state, [ rate, amount ] ] :
    [ ...state.slice(0, -1), [ rate, state[state.length - 1][1] ] ]

export const assign = (source, value) => Object.assign({}, source, value)
export const removeLast = arr => arr.slice(0, arr.length - 1)
export const last = arr => arr[arr.length - 1]
