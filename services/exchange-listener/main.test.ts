import { just } from 'most'
import { run } from 'most-test'
import main from './main'

const makeBinance = ({ candles }) => ({
  candles: jest.fn().mockReturnValue(Promise.resolve(candles))
})

const makeRequester = () => ({
  send: jest.fn().mockReturnValue([ null, 'OK' ])
})

describe('Exchange Binance Listener', () => {
  test('Candles events should be proxied correctly', async () => {
    const responsePersist = jest.fn(function(err, value) { return value })

    const candlesData = [
      { openTime: 1514684700000,
        open: '0.05422400',
        high: '0.05443300',
        low: '0.05413500',
        close: '0.05424400',
        volume: '1513.49500000',
        closeTime: 1514684999999,
        quoteAssetVolume: '31.06542852',
        trades: 2023,
        baseAssetVolume: '572.41700000'
      },
      { openTime: 1514685000000,
        open: '0.05424400',
        high: '0.05425000',
        low: '0.05400000',
        close: '0.05406900',
        volume: '1270.13500000',
        closeTime: 1514685299999,
        quoteAssetVolume: '33.20986049',
        trades: 1817,
        baseAssetVolume: '613.19300000'
      }
    ]

    const symbol = 'BTCUSD'
    const exitProcess = () => {}
    const binance = makeBinance({ candles: candlesData })
    const requester = makeRequester()
    const loopStream = just(null)

    main(exitProcess, loopStream, binance, requester, symbol)

    await run(loopStream).tick()

    expect(binance.candles).toHaveBeenCalledTimes(3)
    expect(binance.candles).toBeCalledWith({ interval: '1m', limit: 50, symbol })

    expect(requester.send).toHaveBeenCalledTimes(3)
    expect(requester.send).toBeCalledWith({
      type: 'cacheHashMultiSet',
      key: 'candles:1m:BTCUSD',
      values: [
        '1514684700000', '[1514684700000,0.054224,0.054433,0.054135,0.054244,1513.495]',
        '1514685000000', '[1514685000000,0.054244,0.05425,0.054,0.054069,1270.135]'
      ]
    })
    expect(requester.send).toBeCalledWith(expect.objectContaining({ key: 'candles:5m:BTCUSD' }))
    expect(requester.send).toBeCalledWith(expect.objectContaining({ key: 'candles:15m:BTCUSD' }))
  })
})
