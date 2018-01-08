import { reduce, takeLast, head, o, min, max, divide, subtract } from 'ramda'

export default (values: number[], period: number = 14) => {
  const last = takeLast(period, values)
  const curr: number = o(head, takeLast(1))(last)
  const low = reduce(min, Infinity)(last)
  const high = reduce(max, -Infinity)(last)
  return divide(subtract(curr, low), subtract(high, low))
}
