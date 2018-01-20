import { just } from 'most'
import { run } from 'most-test'
import main from './main'

const tickers = [
  { symbol: 'ETHBTC', priceChangePercent: '1.332', lowPrice: '0.08793800', highPrice: '0.09300000', lastPrice: '0.09017500' },
  { symbol: 'LTCBTC', priceChangePercent: '2.108', lowPrice: '0.01577700', highPrice: '0.01730000', lastPrice: '0.01700100' },
  { symbol: 'BNBBTC', priceChangePercent: '1.739', lowPrice: '0.00123430', highPrice: '0.00137700', lastPrice: '0.00125780' },
  { symbol: 'BTCUSDT', priceChangePercent: '2.355', lowPrice: '10360.00000000', highPrice: '11878.82000000', lastPrice: '11310.18000000' }
]
const candles = [
  [ 0, 0, 0, 0, '0.09868100' ],
  [ 0, 0, 0, 0, '0.09946000' ],
  [ 0, 0, 0, 0, '0.09911300' ],
  [ 0, 0, 0, 0, '0.09813200' ],
  [ 0, 0, 0, 0, '0.09868100' ],
  [ 0, 0, 0, 0, '0.09946000' ],
  [ 0, 0, 0, 0, '0.09911300' ],
  [ 0, 0, 0, 0, '0.09813200' ],
  [ 0, 0, 0, 0, '0.09868100' ],
  [ 0, 0, 0, 0, '0.09946000' ],
  [ 0, 0, 0, 0, '0.09911300' ],
  [ 0, 0, 0, 0, '0.09813200' ],
  [ 0, 0, 0, 0, '0.09868100' ],
  [ 0, 0, 0, 0, '0.09946000' ],
  [ 0, 0, 0, 0, '0.09911300' ],
  [ 0, 0, 0, 0, '0.09813200' ],
  [ 0, 0, 0, 0, '0.09868100' ],
  [ 0, 0, 0, 0, '0.09946000' ],
  [ 0, 0, 0, 0, '0.09911300' ],
  [ 0, 0, 0, 0, '0.09813200' ],
  [ 0, 0, 0, 0, '0.09868100' ],
  [ 0, 0, 0, 0, '0.09946000' ],
  [ 0, 0, 0, 0, '0.09911300' ],
  [ 0, 0, 0, 0, '0.09813200' ],
  [ 0, 0, 0, 0, '0.09868100' ],
  [ 0, 0, 0, 0, '0.09813200' ],
  [ 0, 0, 0, 0, '0.09868100' ],
  [ 0, 0, 0, 0, '0.09813200' ],
  [ 0, 0, 0, 0, '0.09868100' ],
  [ 0, 0, 0, 0, '0.09813200' ],
  [ 0, 0, 0, 0, '0.09868100' ],
  [ 0, 0, 0, 0, '0.09813200' ],
  [ 0, 0, 0, 0, '0.09868100' ],
  [ 0, 0, 0, 0, '0.09813200' ],
  [ 0, 0, 0, 0, '0.09868100' ],
  [ 0, 0, 0, 0, '0.09868100' ],
  [ 0, 0, 0, 0, '0.09813200' ],
  [ 0, 0, 0, 0, '0.09946000' ]
]

const makeRequesterProcess = () => ({
  send: jest.fn().mockReturnValue(Promise.resolve({ app: {} }))
})

const makeRequesterStore = ({ activeSymbols }) => ({
  send: jest.fn()
    .mockReturnValueOnce(Promise.resolve(activeSymbols))
    .mockReturnValueOnce(Promise.resolve(1))
})

const makePublisher = () => ({
  publish: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn()
})

const makeFetch = ({ tickers, candles }) =>
  jest.fn()
    .mockImplementationOnce(() => Promise.resolve(({ json: () => tickers })))
    .mockImplementation(() => Promise.resolve(({ json: () => candles })))

describe('Trade Master', () => {
  test('When symbol not changed should do nothing', async () => {
    const activeSymbols = [ 'BNBBTC', 'LTCBTC', 'ETHBTC' ]
    const exitProcess = (err: Error) => { throw err }
    const mainLoopStream = just(null)
    const requesterProcess = makeRequesterProcess()
    const requesterStore = makeRequesterStore({ activeSymbols })
    const fetch = makeFetch({ tickers, candles })

    main(exitProcess, mainLoopStream, fetch, requesterStore, requesterProcess)

    await run(mainLoopStream).tick(1)

    expect(requesterStore.send).toHaveBeenCalledTimes(1)
    expect(requesterStore.send).toHaveBeenCalledWith({
      type: 'cacheHashGet',
      key: 'tradeState',
      field: 'activeSymbols'
    })
    expect(requesterProcess.send).toHaveBeenCalledTimes(0)
  })

  test('When symbol changed then should send commands to start process, store new pairs list and stop buys of active symbols', async () => {
    const activeSymbols = [ 'BNBBTC', 'LTCBTC' ]
    const exitProcess = (err: Error) => { throw err }
    const mainLoopStream = just(null)
    const requesterProcess = makeRequesterProcess()
    const requesterStore = makeRequesterStore({ activeSymbols })
    const fetch = makeFetch({ tickers, candles })
    const publisher = makePublisher()

    main(exitProcess, mainLoopStream, fetch, requesterStore, requesterProcess, publisher)

    await run(mainLoopStream).tick(1)

    expect(requesterStore.send).toHaveBeenCalledTimes(2)
    expect(requesterStore.send).toHaveBeenCalledWith({
      type: 'cacheHashGet',
      key: 'tradeState',
      field: 'activeSymbols'
    })
    expect(requesterStore.send).toHaveBeenCalledWith({
      type: 'cacheHashSet',
      key: 'tradeState',
      field: 'activeSymbols',
      value: [ 'BNBBTC', 'LTCBTC', 'ETHBTC' ]
    })

    expect(requesterProcess.send).toHaveBeenCalledTimes(1)
    expect(requesterProcess.send).toHaveBeenCalledWith({
      type: 'processStart',
      options: {
        name: 'Signal Publisher ETHBTC',
        script: './services/signal-publisher/index.ts',
        env: { SYMBOL: 'ETHBTC' }
      }
    })

    expect(publisher.publish).toHaveBeenCalledTimes(1)
    expect(publisher.publish).toHaveBeenCalledWith('finalizeSignalsWork', [ 'BNBBTC', 'LTCBTC' ])
  })
})
