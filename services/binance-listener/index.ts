import { periodic } from 'most'
import { requesterCons, binanceCons } from '../utils/cote'
import main from './main'

const { SYMBOL = 'BNBUSDT' } = process.env
const name = `Binance Exchange Listener ${SYMBOL}`
const requests = [ 'cacheHashMultiSet' ]

const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const binance = binanceCons({})
const requester = requesterCons({ name, requests })
const stream = periodic(30000)

main(exitProcess, stream, binance, requester, SYMBOL)
