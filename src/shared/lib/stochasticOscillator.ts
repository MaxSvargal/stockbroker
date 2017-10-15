export default (current: number, lowest: number, highest: number): number =>
  ((current - lowest) / (highest - lowest)) * 100
