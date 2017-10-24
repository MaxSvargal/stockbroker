export const symbolToPairArr = (symbol: string): string[] | null =>
  symbol.match(/^t(\w{1,3})(\w{1,3})$/)

export const round = (num: number, length: number = 4): number =>
  parseFloat(num.toFixed(length))

export const now = () => Date.now()
export const head = (arr: any[], index: number = 0) => arr[index || 0]
export const tail = (arr: any[], index: number = 0) => arr[arr.length - (index + 1)]
