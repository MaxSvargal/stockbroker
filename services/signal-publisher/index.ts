import { periodic } from 'most'
import { requesterCons, publisherCons } from '../utils/cote'

import main from './main'

// Options
const { SYMBOL = 'BNBUSDT' } = process.env
const name = `Signal Publisher ${SYMBOL}`
const requests = [ 'cacheHashGetValues' ]
const broadcasts = [ 'propagateSignal' ]

// Constructors
const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const requester = requesterCons({ name, requests })
const publisher = publisherCons({ name, broadcasts })
const loopStream = periodic(20000)

main(exitProcess, loopStream, requester, publisher, SYMBOL)
