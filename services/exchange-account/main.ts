import { fromEvent, observe, Stream } from 'most'
import { Requester, Subscriber } from 'cote'
import { o, flip, invoker, map, applyTo } from 'ramda'

import checkOrderSignal from './checkOrderSignal'
import checkStopLimit from './checkStopLimit'

const requestAccount = (id: string) => () =>
  ({ type: 'dbGet', table: 'accounts', id })
const requestClosePosition = (data: { id: number }) =>
  ({ type: 'dbUpdate', table: 'positions', id: data.id, data })
const requestAccountActiveSymbols = (id: string) => (activeSymbols: string[]) =>
  ({ type: 'dbUpdate', table: 'accounts', id, data: { activeSymbols } })
const requestInfoSymbol = (id: string) =>
  ({ type: 'dbGet', table: 'exchangeInfoSymbols', id })
const requestOpenPosition = (data: {}) =>
  ({ type: 'dbInsert', table: 'positions', data })
const requestOpenedPositions = (account: string) => () =>
  ({ type: 'dbGetAll', table: 'positions', by: { account }, filter: { closed: false } })
const requestSymbolsEnabled = () =>
  ({ type: 'dbGet', table: 'tradeState', id: 'symbolsEnabled' })

const invokeSend = flip(invoker(1, 'send'))
const invokeAccountInfo = flip(invoker(1, 'accountInfo'))
const invokeOrder = flip(invoker(1, 'order'))
const invokeMyTrades = flip(invoker(1, 'myTrades'))
const invokePrices = flip(invoker(1, 'prices'))

type Binance = {
  candles: (a: string) => Promise<any[]>,
  accountInfo: () => Promise<{ balances: { asset: string, free: string, locked: string }[] }>
  order: ({}: { symbol: string, side: 'BUY' | 'SELL', quantity: number, type: 'LIMIT' | 'MARKET' }) => Promise<{ orderId: number, status: 'NEW' }>
  myTrades: ({}: { symbol: string, limit: number }) => Promise<{}[]>
}
type ExitProcess = (a: Error) => void
type Account = string
type Main = (a: ExitProcess, b: Account, c: Binance, d: Subscriber, e: Requester, f: Stream) => void
const main: Main = (exitProcess, account, binance, subscriber, requester, loopStream) => {
  const propagateSignalStream = fromEvent('newSignal', subscriber)
  const exitFromSymbolsStream = fromEvent('exitFromSymbols', subscriber)
  const binanceInvokers = [ invokeAccountInfo, invokeOrder, invokeMyTrades, invokePrices ]
  const [ accountInfo, sendOrder, myTrades, getPrices ] = map(applyTo(binance), binanceInvokers)
  const request = invokeSend(requester)

  const requests = {
    getAccount:         o(request, requestAccount(account)),
    setAccountSymbols:  o(request, requestAccountActiveSymbols(account)),
    getOpenedPositions: o(request, requestOpenedPositions(account)),
    getSymbolInfo:      o(request, requestInfoSymbol),
    getSymbolsEnabled:  o(request, requestSymbolsEnabled),
    openPosition:       o(request, requestOpenPosition),
    closePosition:      o(request, requestClosePosition),
    accountInfo,
    sendOrder,
    myTrades,
    getPrices
  }

  observe(checkOrderSignal(account, requests), propagateSignalStream)
  observe(checkStopLimit(requests), loopStream)
}

export default main
