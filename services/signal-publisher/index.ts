import { periodic } from 'most'
import { requesterCons, publisherCons } from '../utils/cote'

import main from './main'

// Options
const { SYMBOL = 'BNBUSDT' } = process.env
const name = `Signal Publisher ${SYMBOL}`
const key = 'store-respond'
const requests = [ 'cacheHashGet', 'cacheHashGetValues' ]
const broadcasts = [ 'propagateSignal' ]

// Constructors
const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const requester = requesterCons({ name, key, requests })
const publisher = publisherCons({ name, broadcasts })
const loopStream = periodic(10000)

main(exitProcess, loopStream, requester, publisher, SYMBOL)
