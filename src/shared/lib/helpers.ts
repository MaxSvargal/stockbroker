export const symbolToPairArr = (symbol: string): string[] | null =>
  symbol.match(/^t(\w{1,3})(\w{1,3})$/)
