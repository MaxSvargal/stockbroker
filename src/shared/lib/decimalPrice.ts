export default class DecimalPrice {
  private num: number
  private int: string
  private fract: string

  constructor(num: number) {
    const [ int, fract = '0' ] = String(num).split('.')
    this.num = num
    this.int = int
    this.fract = fract
  }

  private minimalBit(): number {
    return Number(`0.${Array(5 - String(this.num).split('.')[0].length).join('0')}1`)
  }

  private substract(num: number): number {
     return (Math.floor(this.num * 1e5) - Math.floor(num * 1e5)) / 1e5
  }

  public increaseBit(): number {
    const fraction = Number(this.fract + Array(6 - this.int.length - this.fract.length).join('0'))
    const outputFraction = fraction + 1

    if (String(outputFraction).length > String(fraction).length)
      return Number(this.int) + 1
    else
      return Number(`${this.int}.${fraction + 1}`)
  }

  public decreaseBit(): number {
    const fraction = Number(this.fract + Array(6 - this.int.length - this.fract.length).join('0'))
    const outputFraction = fraction - 1

    if (outputFraction === -1)
      return Number(`${Number(this.int) - 1}.${Array(7 - this.int.length - this.fract.length).join('9')}`)
    else
      return Number(`${this.int}.${fraction - 1}`)
  }

  public substractIsMoreThenBit(num: number): boolean {
    return this.substract(num) > this.minimalBit()
  }
}
