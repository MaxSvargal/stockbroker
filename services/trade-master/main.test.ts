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

const makeRequesterStore = ({ currentSymbol, activeSymbols }) => ({
  send: jest.fn()
    .mockReturnValueOnce(Promise.resolve(currentSymbol))
    .mockReturnValueOnce(Promise.resolve(activeSymbols))
    .mockReturnValueOnce(Promise.resolve(1))
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
  test('When symbol not changed should do nothing', async () => {
    const activeSymbols = [ 'BNBBTC', 'LTCBTC', 'ETHBTC' ]
    const currentSymbol = 'ETHBTC'
    const exchangeInfo = { symbols: [ { symbol: 'ETHBTC', foo: 'bar' } ] }
    const exitProcess = (err: Error) => { throw err }
    const mainLoopStream = just(null)
    const requesterProcess = makeRequesterProcess()
    const requesterPersistStore = makeRequesterStore({ currentSymbol, activeSymbols })
    const requesterRespondStore = makeRequesterStore({ currentSymbol })
    const publisher = makePublisher()
    const fetch = makeFetch({ exchangeInfo, tickers, candles })

    main(exitProcess, mainLoopStream, fetch, requesterPersistStore, requesterRespondStore, requesterProcess, publisher)

    await run(mainLoopStream).tick(1)

    expect(fetch).toHaveBeenCalledTimes(6)

    expect(requesterRespondStore.send).toHaveBeenCalledTimes(1)
    expect(requesterRespondStore.send).toHaveBeenCalledWith({
      type: 'cacheHashGet',
      key: 'tradeState',
      field: 'currentSymbol'
    })

    expect(requesterPersistStore.send).toHaveBeenCalledTimes(2)
    expect(requesterPersistStore.send).toHaveBeenCalledWith({
      type: 'cacheHashMultiSet',
      key: 'exchangeInfoSymbols',
      values: ["ETHBTC", "{\"symbol\":\"ETHBTC\",\"foo\":\"bar\"}"]
    })

    expect(requesterPersistStore.send).toHaveBeenCalledTimes(2)
    expect(requesterPersistStore.send).toHaveBeenCalledWith({
      type: 'cacheHashSet',
      key: 'tradeState',
      field: 'symbolWeights',
      value: '[0.00006435655853105975,0.00006435655853105975,0.00006435655853105975,0.00006435655853105975]'
    })

    expect(requesterProcess.send).toHaveBeenCalledTimes(0)
  })

  test('When symbol changed then should send commands to start process, store new pairs list and stop buys of active symbols', async () => {
    const activeSymbols = [ 'BNBBTC', 'LTCBTC' ]
    const currentSymbol = 'LTCBTC'
    const exchangeInfo = { symbols: [ { symbol: 'ETHBTC', foo: 'bar' } ] }
    const exitProcess = (err: Error) => { throw err }
    const mainLoopStream = just(null)
    const requesterProcess = makeRequesterProcess()
    const requesterPersistStore = makeRequesterStore({ currentSymbol, activeSymbols })
    const requesterRespondStore = makeRequesterStore({ currentSymbol })
    const publisher = makePublisher()
    const fetch = makeFetch({ exchangeInfo, tickers, candles })

    main(exitProcess, mainLoopStream, fetch, requesterPersistStore, requesterRespondStore, requesterProcess, publisher)

    await run(mainLoopStream).tick(1)

    expect(fetch).toHaveBeenCalledTimes(6)

    expect(requesterRespondStore.send).toHaveBeenCalledTimes(1)
    expect(requesterRespondStore.send).toHaveBeenCalledWith({
      type: 'cacheHashGet',
      key: 'tradeState',
      field: 'currentSymbol'
    })

    expect(requesterPersistStore.send).toHaveBeenCalledTimes(3)
    expect(requesterPersistStore.send).toHaveBeenCalledWith({
      type: 'cacheHashSet',
      key: 'tradeState',
      field: 'currentSymbol',
      value: 'ETHBTC'
    })
    expect(requesterPersistStore.send).toHaveBeenCalledWith({
      type: 'cacheHashMultiSet',
      key: 'exchangeInfoSymbols',
      values: ["ETHBTC", "{\"symbol\":\"ETHBTC\",\"foo\":\"bar\"}"]
    })
    expect(requesterPersistStore.send).toHaveBeenCalledWith({
      type: 'cacheHashSet',
      key: 'tradeState',
      field: 'symbolWeights',
      value: '[0.00006435655853105975,0.00006435655853105975,0.00006435655853105975,0.00006435655853105975]'
    })

    expect(requesterProcess.send).toHaveBeenCalledTimes(2)
    expect(requesterProcess.send).toHaveBeenCalledWith({
      type: 'processStart',
      options: {
        name: 'Signal Publisher ETHBTC',
        script: './services/signal-publisher/index.ts',
        env: { SYMBOL: 'ETHBTC' }
      }
    })
    expect(requesterProcess.send).toHaveBeenCalledWith({
      type: 'processStart',
      options: {
        name: 'Binance Exchange Listener ETHBTC',
        script: './services/binance-listener/index.ts',
        env: { SYMBOL: 'ETHBTC' }
      }
    })

    expect(publisher.publish).toHaveBeenCalledTimes(0)
  })
  test('When any symbol weight is down, publish event to accounts', async () => {
    const activeSymbols = [ 'BNBBTC', 'LTCBTC' ]
    const currentSymbol = 'LTCBTC'
    const exchangeInfo = { symbols: [ { symbol: 'ETHBTC', foo: 'bar' } ] }
    const overCandles = [ ...candles, [ 0, 0, 0, 0, '0.09846000' ], [ 0, 0, 0, 0, '0.09746000' ] ]
    const exitProcess = (err: Error) => { throw err }
    const mainLoopStream = just(null)
    const requesterProcess = makeRequesterProcess()
    const requesterPersistStore = makeRequesterStore({ currentSymbol, activeSymbols })
    const requesterRespondStore = makeRequesterStore({ currentSymbol })
    const publisher = makePublisher()
    const fetch = makeFetch({ exchangeInfo, tickers, candles: overCandles })

    main(exitProcess, mainLoopStream, fetch, requesterPersistStore, requesterRespondStore, requesterProcess, publisher)

    await run(mainLoopStream).tick(1)

    expect(fetch).toHaveBeenCalledTimes(6)

    expect(requesterRespondStore.send).toHaveBeenCalledTimes(1)
    expect(requesterRespondStore.send).toHaveBeenCalledWith({
      type: 'cacheHashGet',
      key: 'tradeState',
      field: 'currentSymbol'
    })

    expect(requesterPersistStore.send).toHaveBeenCalledTimes(2)
    expect(requesterPersistStore.send).toHaveBeenCalledWith({
      type: 'cacheHashMultiSet',
      key: 'exchangeInfoSymbols',
      values: ["ETHBTC", "{\"symbol\":\"ETHBTC\",\"foo\":\"bar\"}"]
    })
    expect(requesterPersistStore.send).toHaveBeenCalledWith({
      type: 'cacheHashSet',
      key: 'tradeState',
      field: 'symbolWeights',
      value: '[-0.00007487776531014113,-0.00007487776531014113,-0.00007487776531014113,-0.00007487776531014113]'
    })

    expect(requesterProcess.send).toHaveBeenCalledTimes(0)

    expect(publisher.publish).toHaveBeenCalledTimes(1)
    expect(publisher.publish).toHaveBeenCalledWith('exitFromSymbols', ["BTCUSDT", "LTCBTC", "BNBBTC", "ETHBTC"])
  })
})
