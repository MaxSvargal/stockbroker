import { just } from 'most'
import { run } from 'most-test'
import main from './main'

const tickers = [
  { symbol: 'ETHBTC', priceChangePercent: '1.332', lowPrice: '0.08793800', highPrice: '0.09300000', lastPrice: '0.09017500' },
  { symbol: 'LTCBTC', priceChangePercent: '2.108', lowPrice: '0.01577700', highPrice: '0.01730000', lastPrice: '0.01700100' },
  { symbol: 'BNBBTC', priceChangePercent: '1.739', lowPrice: '0.00123430', highPrice: '0.00137700', lastPrice: '0.00125780' },
  { symbol: 'BTCUSDT', priceChangePercent: '2.355', lowPrice: '10360.00000000', highPrice: '11878.82000000', lastPrice: '11310.18000000' },
  { symbol: 'ETHUSDT', priceChangePercent: '0.355', lowPrice: '1002.00000000', highPrice: '1100.82000000', lastPrice: '1004.18000000' }
]
const candles = [
  // time, open, high, low, close
  [ 0, '0.01000000', '0.02000000', '0.01000000', '0.02500000' ],
  [ 0, '0.02500000', '0.03000000', '0.01000000', '0.02500000' ],
  [ 0, '0.02500000', '0.04000000', '0.02000000', '0.03500000' ],
  [ 0, '0.03500000', '0.05000000', '0.03000000', '0.04500000' ],
  [ 0, '0.04500000', '0.06000000', '0.04000000', '0.05500000' ],
  [ 0, '0.05500000', '0.07000000', '0.05000000', '0.06500000' ],
  [ 0, '0.06500000', '0.08000000', '0.06000000', '0.07500000' ],
  [ 0, '0.01000000', '0.02000000', '0.01000000', '0.02500000' ],
  [ 0, '0.02500000', '0.03000000', '0.01000000', '0.02500000' ],
  [ 0, '0.02500000', '0.04000000', '0.02000000', '0.03500000' ],
  [ 0, '0.03500000', '0.05000000', '0.03000000', '0.04500000' ],
  [ 0, '0.04500000', '0.06000000', '0.04000000', '0.05500000' ],
  [ 0, '0.05500000', '0.07000000', '0.05000000', '0.06500000' ],
  [ 0, '0.06500000', '0.08000000', '0.06000000', '0.07500000' ],
  [ 0, '0.07500000', '0.09000000', '0.07000000', '0.08500000' ],
  [ 0, '0.01000000', '0.02000000', '0.01000000', '0.02500000' ],
  [ 0, '0.02500000', '0.03000000', '0.01000000', '0.02500000' ],
  [ 0, '0.02500000', '0.04000000', '0.02000000', '0.03500000' ],
  [ 0, '0.03500000', '0.05000000', '0.03000000', '0.04500000' ],
  [ 0, '0.04500000', '0.06000000', '0.04000000', '0.05500000' ],
  [ 0, '0.05500000', '0.07000000', '0.05000000', '0.06500000' ],
]

const makeRequesterProcess = () => ({
  send: jest.fn().mockReturnValue(Promise.resolve({ app: {} }))
})

const makePersistStore = () => ({
  send: jest.fn().mockReturnValue('OK')
})

const makePublisher = () => ({
  publish: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn()
})

const makeFetch = ({ exchangeInfo, tickers, candles }) =>
  jest.fn()
    .mockImplementationOnce(() => Promise.resolve(({ json: () => exchangeInfo })))
    .mockImplementationOnce(() => Promise.resolve(({ json: () => tickers })))
    .mockImplementation(() => Promise.resolve(({ json: () => candles })))

describe('Trade Master', () => {
  test('Should store enables symbols to stop and start all services correctly', async () => {
    const exchangeInfo = { symbols: [ { symbol: 'ETHBTC' } ] }
    const exitProcess = (err: Error) => { throw err }
    const mainLoopStream = just(null)
    const requesterProcess = makeRequesterProcess()
    const requesterPersistStore = makePersistStore()
    const publisher = makePublisher()
    const fetch = makeFetch({ exchangeInfo, tickers, candles })

    main(exitProcess, mainLoopStream, fetch, requesterPersistStore, requesterProcess, publisher)

    await run(mainLoopStream).tick(1)

    expect(fetch).toHaveBeenCalledTimes(6)

    expect(requesterPersistStore.send).toHaveBeenCalledTimes(2)
    expect(requesterPersistStore.send).toHaveBeenCalledWith({
      type: 'cacheHashMultiSet',
      key: 'exchangeInfoSymbols',
      values: ["ETHBTC", "{\"symbol\":\"ETHBTC\"}"]
    })
    expect(requesterPersistStore.send).toHaveBeenCalledWith({
      type: 'cacheHashSet',
      key: 'tradeState',
      field: 'enabledToBuySymbols',
      value: '[\"BTCUSDT\",\"LTCBTC\",\"BNBBTC\",\"ETHBTC\"]'
    })

    expect(requesterProcess.send).toHaveBeenCalledTimes(8)
    expect(requesterProcess.send).toHaveBeenCalledWith({
      type: 'processStart',
      options: {
        name: 'Signal Publisher ETHBTC',
        script: './services/signal-publisher/index.ts',
        env: { SYMBOL: 'ETHBTC', DEBUG: 'app:log' }
      }
    })
  })

  test('Should publish event to close all positions', async () => {
    const overCandles = [
      ...candles,
      [ 0, '0.05500000', '0.05000000', '0.05000000', '0.05500000' ],
      [ 0, '0.06500000', '0.06000000', '0.06000000', '0.06500000' ],
      [ 0, '0.08500000', '0.08000000', '0.08000000', '0.08500000' ],
      [ 0, '0.09500000', '0.09000000', '0.09000000', '0.09500000' ],
      [ 0, '0.09500000', '0.09000000', '0.09000000', '0.19500000' ],
      [ 0, '0.19500000', '0.19000000', '0.19000000', '0.19500000' ],
      [ 0, '0.39500000', '0.39000000', '0.39000000', '0.39500000' ],
      [ 0, '0.49500000', '0.49000000', '0.49000000', '0.49500000' ],
      [ 0, '0.50500000', '0.50000000', '0.50000000', '0.50500000' ],
      [ 0, '0.69500000', '0.69000000', '0.69000000', '0.81500000' ],
      [ 0, '0.81500000', '0.89000000', '0.99000000', '0.99500000' ],
      [ 0, '0.02500000', '0.03000000', '0.02000000', '0.02500000' ]
    ]
    const exchangeInfo = { symbols: [ { symbol: 'ETHBTC' } ] }
    const exitProcess = (err: Error) => { throw err }
    const mainLoopStream = just(null)
    const requesterProcess = makeRequesterProcess()
    const requesterPersistStore = makePersistStore()
    const publisher = makePublisher()
    const fetch = makeFetch({ exchangeInfo, tickers, candles: overCandles })

    main(exitProcess, mainLoopStream, fetch, requesterPersistStore, requesterProcess, publisher)

    await run(mainLoopStream).tick(1)

    expect(fetch).toHaveBeenCalledTimes(6)

    expect(requesterProcess.send).toHaveBeenCalledTimes(0)

    expect(publisher.publish).toHaveBeenCalledTimes(1)
    expect(publisher.publish).toHaveBeenCalledWith('exitFromSymbols', ["BTCUSDT", "LTCBTC", "BNBBTC", "ETHBTC"])
  })
})
