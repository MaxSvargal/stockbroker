import { fromEvent } from 'most'
import { run } from 'most-test'
import { Subscriber } from 'cote'
import main from './main'

const tick = () => Promise.resolve()

const makeResponder = () => ({
  on: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn()
})

const makePM2 = () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  start: jest.fn(),
  delete: jest.fn(),
})

describe('PM2 Manager', () => {
  test('processStart should work correctly', async () => {
    const exitProcess = jest.fn()
    const responder = makeResponder()
    const pm2 = makePM2()
    const responseCb = jest.fn(function(err, value) { return value })

    main(exitProcess, pm2, responder)

    await tick()

    const connectCalls = pm2.connect.mock.calls
    expect(connectCalls).toHaveLength(1)
    connectCalls[0][0]() // exec callback

    await tick()

    const listenersCalls = responder.addListener.mock.calls
    expect(listenersCalls).toHaveLength(3)
    const processStart = listenersCalls[0][1]
    processStart([
      {
        type: 'processStart',
        options: {
          name: `Signal Publisher BTGETH`,
          script: './services/signal-publisher/index.ts',
          env: { SYMBOL: 'BTGETH' }
        }
      },
      responseCb
    ])

    await tick()

    const pm2StartCalls = pm2.start.mock.calls
    expect(pm2StartCalls).toHaveLength(1)
    expect(pm2StartCalls[0][0]).toEqual({
      name: `Signal Publisher BTGETH`,
      script: './services/signal-publisher/index.ts',
      env: { SYMBOL: 'BTGETH' }
    })
    expect(pm2StartCalls[0][1]).toBeInstanceOf(Function)
    pm2StartCalls[0][1](null, { app: 'data' }) // exec callback

    await tick()

    expect(responseCb).toBeCalledWith(null, { app: 'data' })
  })
  test('processDelete should work correctly', async () => {
    const exitProcess = jest.fn()
    const responder = makeResponder()
    const pm2 = makePM2()
    const responseCb = jest.fn(function(err, value) { return value })

    main(exitProcess, pm2, responder)

    await tick()

    const connectCalls = pm2.connect.mock.calls
    expect(connectCalls).toHaveLength(1)
    connectCalls[0][0]() // exec callback

    await tick()

    const listenersCalls = responder.addListener.mock.calls
    expect(listenersCalls).toHaveLength(3)
    const processDelete = listenersCalls[2][1]
    processDelete([
      {
        type: 'processDelete',
        name: `Signal Publisher BTGETH`
      },
      responseCb
    ])

    await tick()

    const pm2DeleteCalls = pm2.delete.mock.calls
    expect(pm2DeleteCalls).toHaveLength(1)
    expect(pm2DeleteCalls[0][0]).toEqual(`Signal Publisher BTGETH`)
    expect(pm2DeleteCalls[0][1]).toBeInstanceOf(Function)
    pm2DeleteCalls[0][1](null) // exec callback

    await tick()
    expect(responseCb).toBeCalledWith(null, 'Signal Publisher BTGETH')
  })
})
