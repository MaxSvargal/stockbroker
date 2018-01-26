import { fromEvent, observe, throttle } from 'most'
import { Requester, Subscriber } from 'cote'
import { o, flip, invoker, map, applyTo } from 'ramda'

import {
  requestPositions, requestSetPosition, requestEnabledToBuySymbols,
  requestAccountActiveSymbols, requestSetAccountActiveSymbols, requestExchangeInfoSymbols
} from './requests'

import checkOrderSignal from './checkOrderSignal'
import checkExitFromSymbols from './checkExitFromSymbols'

const invokeSend = flip(invoker(1, 'send'))
const invokeAccountInfo = flip(invoker(1, 'accountInfo'))
const invokeOrder = flip(invoker(1, 'order'))
const invokeMyTrades = flip(invoker(1, 'myTrades'))

type Binance = {
  candles: (a: string) => Promise<any[]>,
  accountInfo: () => Promise<{ balances: { asset: string, free: string, locked: string }[] }>
  order: ({}: { symbol: string, side: 'BUY' | 'SELL', quantity: number, type: 'LIMIT' | 'MARKET' }) => Promise<{ orderId: number, status: 'NEW' }>
  myTrades: ({}: { symbol: string, limit: number }) => Promise<{}[]>
}
type ExitProcess = (a: Error) => void
type Account = string
type Main = (a: ExitProcess, b: Binance, c: Subscriber, d: Requester, e: Requester, f: Account) => void
const main: Main = (exitProcess, binance, subscriber, requesterRespondStore, requesterPersistStore, account) => {
  const propagateSignalStream = fromEvent('newSignal', subscriber)
  const exitFromSymbolsStream = fromEvent('exitFromSymbols', subscriber)
  const binanceInvokers = [ invokeAccountInfo, invokeOrder, invokeMyTrades ]
  const [ accountInfo, sendOrder, myTrades ] = map(applyTo(binance), binanceInvokers)

  const storeRequest = invokeSend(requesterRespondStore)
  const storePersist = invokeSend(requesterPersistStore)

  const requests = {
    getAccountActiveSymbols:  o(storeRequest, requestAccountActiveSymbols(account)),
    getEnabledToBuySymbols:   o(storeRequest, requestEnabledToBuySymbols),
    getExchangeInfoOfSymbol:   o(storeRequest, requestExchangeInfoSymbols),
    getPositions:             o(storeRequest, requestPositions(account)),
    setAccountActiveSymbols:  o(storeRequest, requestSetAccountActiveSymbols(account)),
    setPosition:              o(storePersist, requestSetPosition(account)),
    accountInfo,
    sendOrder,
    myTrades
  }

  observe(checkOrderSignal(account, requests), throttle(20000, propagateSignalStream))
  observe(checkExitFromSymbols(requests), exitFromSymbolsStream)
}

export default main
