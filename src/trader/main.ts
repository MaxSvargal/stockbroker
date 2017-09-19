const inc = (a: number): number => ++a

export default function add(a: number, b: number): number {
  return a + inc(b)
}
