import { periodic } from 'most'
import { requesterCons, publisherCons, binanceCons } from '../utils/cote'

import main from './main'

// Options
const { SYMBOL = 'BNBUSDT' } = process.env
const symbol = SYMBOL
const name = `Signaller ${symbol}`
const broadcasts = [ 'newSignal' ]

// Constructors
const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const binance = binanceCons({})
const publisher = publisherCons({ name, broadcasts })
const mainLoopStream = periodic(30000)

main(exitProcess, mainLoopStream, binance, publisher, symbol)
