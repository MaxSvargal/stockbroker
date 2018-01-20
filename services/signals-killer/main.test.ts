import main from './main'

const makeStoreRequester = (activeSymbols: string[]) => ({
  send: jest.fn()
    .mockReturnValueOnce(Promise.resolve(activeSymbols))
})

const makeProcessesRequester = (stopResponse: {}) => ({
  send: jest.fn()
    .mockReturnValueOnce(Promise.resolve(stopResponse))
})

describe('Signals Killer', () => {
  test('Should scan active account processes and kill unused signal publishers', () => {
    const activeSymbols = [
      [ 'ETHBTC', 'LTCBTC', 'BNBBTC', 'NEOBTC' ],
      [ 'ETHBTC', 'LTCBTC', 'BNBBTC', 'NEOBTC' ],
      [ 'ETHBTC', 'LTCBTC', 'BNBBTC', 'NEOBTC' ]
    ]
    const storeRequester = makeStoreRequester({ activeSymbols })
  })
})
