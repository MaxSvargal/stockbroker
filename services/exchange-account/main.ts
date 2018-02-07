import { fromEvent, observe } from 'most'
import { Requester, Subscriber } from 'cote'
import { o, flip, invoker, map, applyTo } from 'ramda'

import checkOrderSignal from './checkOrderSignal'
import checkExitFromSymbols from './checkExitFromSymbols'

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

type Binance = {
  candles: (a: string) => Promise<any[]>,
  accountInfo: () => Promise<{ balances: { asset: string, free: string, locked: string }[] }>
  order: ({}: { symbol: string, side: 'BUY' | 'SELL', quantity: number, type: 'LIMIT' | 'MARKET' }) => Promise<{ orderId: number, status: 'NEW' }>
  myTrades: ({}: { symbol: string, limit: number }) => Promise<{}[]>
}
type ExitProcess = (a: Error) => void
type Account = string
type Main = (a: ExitProcess, b: Binance, c: Subscriber, d: Requester, f: Account) => void
const main: Main = (exitProcess, binance, subscriber, requester, account) => {
  const propagateSignalStream = fromEvent('newSignal', subscriber)
  const exitFromSymbolsStream = fromEvent('exitFromSymbols', subscriber)
  const binanceInvokers = [ invokeAccountInfo, invokeOrder, invokeMyTrades ]
  const [ accountInfo, sendOrder, myTrades ] = map(applyTo(binance), binanceInvokers)

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
    myTrades
  }

  // TODO: check stop limit for every trade

  // const test = async () => {
  //   try {
  //     console.log('request')
  //     const openCount = await requests.getOpenPosCount(null)
  //     console.log({ openCount })
  //
  //     const account = await requests.getAccount(null)
  //     console.log({ account })
  //     const positions = await requests.getPositions('NEOBTC')
  //     console.log({ positions })
  //     const symbolInfo = await requests.getSymbolInfo('WTCBTC')
  //     console.log({ symbolInfo })
  //     const symbolsEnabled = await requests.getSymbolsEnabled(null)
  //     console.log({ symbolsEnabled })
  //
  //     // const openStatus = await requests.openPosition({
  //     //   id: 1215, account: 'maxsvargal', symbol: 'NEOBTC', closed: false, open: { id: 356, orderId: 455234, qty: 1, origQty: 1, price: 0.000034 }
  //     // })
  //     // console.log({ openStatus })
  //
  //     // const closeStatus = await requests.closePosition({
  //     //   id: 1215, closed: true, close: { id: 357, orderId: 455235, qty: 1, origQty: 1, price: 0.000064 }
  //     // })
  //     // console.log({ closeStatus })
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }
  //
  // test()

  observe(checkOrderSignal(account, requests), propagateSignalStream)
  observe(checkExitFromSymbols(requests), exitFromSymbolsStream)
}

export default main
