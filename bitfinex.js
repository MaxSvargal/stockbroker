const BFX = require('bitfinex-api-node')
const debug = require('debug')('dev')

const API_KEY = 'o7yl00PaXcqt6SiNtinCLW2GeEWGMXlaCxAp7sIv6J8'
const API_SECRET = 'SD1xukgXJVFEDAhLr3L0f13J06VRWFHDhtWCubPJHLQ'

const opts = {
  version: 1,
  transform: false
}

const { ws, rest } = new BFX(API_KEY, API_SECRET, opts)

rest.past_trades('BTCUSD', {}, (err, resp) => console.log({ err, resp }))

// ws.on('auth', () => {
//   // emitted after .auth()
//   // needed for private api endpoints
//
//   debug('authenticated')
//   // ws.submitOrder ...
// })
//
// ws.on('open', () => {
//   ws.subscribeTicker('BTCUSD')
//   // ws.subscribeTicker('ETHUSD')
//   // ws.subscribeOrderBook('BTCUSD')
//   // ws.subscribeTrades('BTCUSD')
//   // ws.subscribeTrades('ETHUSD')
//
//   // ws.subscribeCandles('tBTCUSD', '1h')
//   // ws.subscribeCandles('tBTCUSD', '1m')
//
//   // authenticate
//   ws.auth()
// })
//
// ws.on('orderbook', (pair, book) => {
//   debug(`Order book ${pair}:`, book)
// })
//
// ws.on('trade', (pair, trade) => {
//   debug(`Trade ${pair}:`, trade)
// })
//
// ws.on('ticker', (pair, ticker) => {
//   debug(`Ticker ${pair}:`, ticker)
// })
//
// ws.on('ws', (...data) => {
//   debug('Wallet:', data)
// })
//
// const calcVertex = candles => {
//   const [ trueRangeSum, vmUpSum, vmDnSum ] = candles
//     .map((v, i, a) => {
//       if (a.length === i + 1) return
//       const [ pMts, pOpen, pClose, pHight, pLow ] = a[i]
//       const [ cMts, cOpen, cClose, cHight, cLow ] = a[i + 1]
//
//       const trueRange = Math.max(pHight - cLow, cLow - pClose, cHight - pClose)
//       const vmUp = cHight - pLow
//       const vmDn = cLow - pHight
//
//       return [ trueRange, vmUp, vmDn ]
//     })
//     .slice(0, -1)
//     .reduce((p, c) => [ p[0] + c[0], p[1] + c[1], p[2] + c[2] ])
//
//   const VIup = vmUpSum / trueRangeSum
//   const VIdn = vmDnSum / trueRangeSum
//
//   debug({ VIup, VIdn })
//   return [ VIup, VIdn ]
// }
//
// let candlesCache = []
// ws.on('candles', (key, candles) => {
//   debug({ key, candles })
//   if (Array.isArray(candles[0]))
//     candlesCache = candles
//   else
//     [ candles, ...candlesCache.slice(1, 8) ]
//
//   debug(candles)
//   calcVertex(candlesCache)
// })
//
// ws.on('error', console.error)
