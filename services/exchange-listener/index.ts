import { periodic } from 'most'
import { requesterCons, binanceCons } from '../utils/cote'
import main from './main'

const { SYMBOL = 'BNBUSDT' } = process.env
const name = `Exchange Listener ${SYMBOL}`
const key = 'store-persist'
const requests = [ 'cacheHashMultiSet' ]

const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const binance = binanceCons({})
const requester = requesterCons({ name, key, requests })
const stream = periodic(10000)

main(exitProcess, stream, binance, requester, SYMBOL)
