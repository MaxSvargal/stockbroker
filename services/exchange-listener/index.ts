import { publisherCons, bfxCons } from '../utils/cote'
import main from './main'

const SYMBOL = process.env.SYMBOL || 'tBTCUSD'
const name = `Exchange Listener ${SYMBOL}`

const exitProcess = () => process.exit(1)
const { ws } = bfxCons(null, null, { version: 2 })
const publisher = publisherCons({ name })

main(exitProcess, ws, publisher, SYMBOL)
