import main from './main'
import { just } from 'most'
import { run } from 'most-test'

const makeStoreRequester = (activeSymbols: string[], enabledSymbols: string[]) => ({
  send: jest.fn()
    .mockReturnValueOnce(Promise.resolve(activeSymbols))
    .mockReturnValueOnce(Promise.resolve(enabledSymbols))
})

const makeProcessesRequester = (processesList: {}[]) => ({
  send: jest.fn()
    .mockReturnValueOnce(Promise.resolve(processesList))
})

describe('Signallers Manager', () => {
  test('Should scan active account processes and kill unused signal publishers', async () => {
    const exitProcess = jest.fn()
    const mainLoopStream = just(null)
    const requesterStore = makeStoreRequester([ 'DNTBTC', 'ADXBTC' ], [ 'ADXBTC', 'ARKBTC', 'NANOBTC' ])
    const requesterProcesses = makeProcessesRequester([
      { name: 'Signaller DNTBTC', pid: 1 },
      { name: 'Signaller NANOBTC', pid: 0 },
      { name: 'Signaller NEOBTC', pid: 2 }
    ])
    main(exitProcess, mainLoopStream, requesterStore, requesterProcesses)

    await run(mainLoopStream).tick(1)

    expect(requesterStore.send).toHaveBeenCalledTimes(2)
    expect(requesterProcesses.send).toHaveBeenCalledTimes(5)
    expect(requesterProcesses.send).toHaveBeenCalledWith({
      type: 'processStop',
      name: 'Signaller NEOBTC'
    })
    expect(requesterProcesses.send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'processStart',
        options: expect.objectContaining({
          name: 'Signaller ADXBTC'
        })
      })
    )
    expect(requesterProcesses.send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'processStart',
        options: expect.objectContaining({
          name: 'Signaller ARKBTC'
        })
      })
    )
    expect(requesterProcesses.send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'processStart',
        options: expect.objectContaining({
          name: 'Signaller NANOBTC'
        })
      })
    )
  })
})
