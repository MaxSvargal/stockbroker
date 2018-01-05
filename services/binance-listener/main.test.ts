import { just } from 'most'
import { run } from 'most-test'
import main from './main'

const makeBinance = ({ candles }) => ({
  candles: jest.fn().mockReturnValue(Promise.resolve(candles))
})

const makePublisher = () => ({
  publish: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn()
})

describe('Exchange Binance Listener', () => {
  test('Candles events should be proxied correctly', async () => {

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

    const candlesExpected = [
      [ 1514684700000, '0.05422400', '0.05424400', '0.05443300', '0.05413500', '1513.49500000' ],
      [ 1514685000000, '0.05424400', '0.05406900', '0.05425000', '0.05400000', '1270.13500000' ]
    ]

    const symbol = 'BTCUSD'
    const exitProcess = () => {}
    const binance = makeBinance({ candles: candlesData })
    const publisher = makePublisher()
    const loopStream = just(null)

    main(exitProcess, loopStream, binance, publisher, symbol)

    await run(loopStream).tick()

    expect(binance.candles).toHaveBeenCalledTimes(3)
    expect(binance.candles).toBeCalledWith({ interval: '1m', limit: 50, symbol })
    expect(binance.candles).toBeCalledWith({ interval: '5m', limit: 50, symbol })
    expect(binance.candles).toBeCalledWith({ interval: '15m', limit: 50, symbol })

    expect(publisher.publish).toHaveBeenCalledTimes(3)
    expect(publisher.publish).toBeCalledWith('storeSet', [ 'candles:1m:BTCUSD', candlesExpected ])
    expect(publisher.publish).toBeCalledWith('storeSet', [ 'candles:5m:BTCUSD', candlesExpected ])
    expect(publisher.publish).toBeCalledWith('storeSet', [ 'candles:15m:BTCUSD', candlesExpected ])
  })
})
