import { fromEvent } from 'most'
import { run } from 'most-test'
import { Server } from 'mock-socket'
import { Publisher } from 'cote'
import main from './main'

// mock bitfinex ws
// mock
const makeServer = function() {
  return new Server('ws://localhost:8080')
}

const makeBWS = function() {
  const ws = new WebSocket('ws://localhost:8080')
  ws.subscribeOrderBook = jest.fn()
  ws.subscribeCandles = jest.fn()
  return ws
}

const makePublisher = () => ({
  publish: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn()
})

describe('Exchange Listener', () => {
  test('Candles and Orderbook events should be proxied correctly', done => {
    const symbol = 'tBTCUSD'
    const exitProcess = () => {}
    const server = makeServer()
    const ws = makeBWS()
    const publisher = makePublisher()
    const stream = fromEvent('orderbook', publisher)

    const updateOrderbookData = [ 'tBTCUSD', [ 15188, 0, -1 ] ]
    const setOrderbookData = [ 'tBTCUSD', [ [ 15188, 0, -1 ], [ 16111, 1, 1 ] ] ]

    const updateCandlesData = [ 'trade:15m:tBTCUSD', [
      1514292300000, 14992, 14997, 14998, 14955, 423.69119072 ]
    ]
    const setCandlesData = [ 'trade:1m:tBTCUSD', [
      [ 1514292300000, 14992, 14997, 14998, 14955, 423.69119072 ],
      [ 1514292300000, 14992, 14997, 14998, 14955, 423.69119072 ]
    ]

    server.on('connection', (server: any) => {
      server.emit('orderbook', [ updateOrderbookData ])
      server.emit('orderbook', [ setOrderbookData ])
      server.emit('candles', [ updateCandlesData ])
      server.emit('candles', [ setCandlesData ])

      expect(publisher.publish.mock.calls[0])
        .toEqual([ 'storeUpdate', [ 'orderbook:tBTCUSD', updateOrderbookData[1] ] ])
      expect(publisher.publish.mock.calls[1])
        .toEqual([ 'storeSet', [ 'orderbook:tBTCUSD', setOrderbookData[1] ] ])
      expect(publisher.publish.mock.calls[2])
        .toEqual([ 'storeUpdate', [ 'candles:trade:15m:tBTCUSD', updateCandlesData[1] ] ])
      expect(publisher.publish.mock.calls[3])
        .toEqual([ 'storeSet', [ 'candles:trade:1m:tBTCUSD', setCandlesData[1] ] ])
      done()
    })

    main(exitProcess, ws, publisher, 'tBTCUSD')
  })
})
