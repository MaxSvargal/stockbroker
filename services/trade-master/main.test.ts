import main from './main'
import { just } from 'most'
import { run } from 'most-test'

describe('Trade Master', () => {
  test('should work correctly', async () => {
    const exitProcess = jest.fn()
    const mainLoopStream = just(null)
    const fetch = jest.fn().mockImplementation(() => ({
      json: jest.fn()
        .mockReturnValueOnce({ symbols: {} })
    }))
    const requesterProcess = jest.fn()
    const requesterDb = { send: jest.fn() }

    main(exitProcess, mainLoopStream, fetch, requesterProcess, requesterDb)

    await run(mainLoopStream).tick(1)

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(requesterDb.send).toHaveBeenCalledTimes(1)
  })
})