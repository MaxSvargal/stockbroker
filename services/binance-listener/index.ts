import { periodic } from 'most'
import { publisherCons, binanceCons } from '../utils/cote'
import main from './main'

const { SYMBOL = 'BNBUSDT' } = process.env
const name = `Binance Exchange Listener ${SYMBOL}`
const broadcasts = [ 'storeSet', 'storeUpdate' ]

const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const binance = binanceCons({})
const publisher = publisherCons({ name, broadcasts })
const stream = periodic(10000)

main(exitProcess, stream, binance, publisher, SYMBOL)
