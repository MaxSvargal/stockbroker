import { publisherCons, bfxCons } from '../utils/cote'
import main from './main'

const { SYMBOL = 'BTCUSD' } = process.env
const name = `Exchange Listener ${SYMBOL}`
const broadcasts = [ 'storeSet', 'storeUpdate' ]

const exitProcess = () => process.exit(1)
const { ws } = bfxCons(null, null, { version: 2 })
const publisher = publisherCons({ name, broadcasts })

main(exitProcess, ws, publisher, SYMBOL)
