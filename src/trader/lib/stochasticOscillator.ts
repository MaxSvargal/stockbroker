export default (current: number, lowest: number, highest: number) =>
  ((current - lowest) / (highest - lowest)) * 100

export const SMA = (values: number[]) =>
  values.reduce((a, b) => a + b) / values.length
