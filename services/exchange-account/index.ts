import { subscriberCons, requesterCons, binanceCons } from '../utils/cote'
import { periodic } from 'most'
import main from './main'

const { ACCOUNT, KEY, SECRET } = process.env

const subscriber = subscriberCons({
  name: `Exchange Account ${ACCOUNT}`,
  subscribesTo: [ 'newSignal', 'exitFromSymbols' ]
})

const requester = requesterCons({
  name: `Exchange Account ${ACCOUNT} DB Requester`,
  key: 'db',
  requests: [ 'dbGet', 'dbUpdate', 'dbInsert', 'dbGetAll' ]
})

const exitProcess = (err: Error) => {
  console.error(err)
  process.exit(1)
}
const binance = binanceCons({ apiKey: KEY, apiSecret: SECRET })
const checkStopLimitLoopStream = periodic(60000)
const account = ACCOUNT

main(exitProcess, account, binance, subscriber, requester, checkStopLimitLoopStream)
