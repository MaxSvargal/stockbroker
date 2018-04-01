import * as aes256 from 'aes256'
import { readFileSync } from 'fs'

export default (str: string): string =>
  aes256.decrypt(readFileSync(`${__dirname}/secret.txt`, 'utf8'), str)
