import { randomBytes } from 'crypto'

export const randomInt = (bytes = 6) => parseInt(randomBytes(bytes).toString('hex'), 16)
export const shortTimeInt = () => Math.floor(new Date().getTime() / 1e3)
