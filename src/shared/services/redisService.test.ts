const clientOnMock = jest.fn()
const clientGetMock = jest.fn()
const clientSubscribeMock = jest.fn()

jest.mock('redis', () => ({
  createClient: () => ({
    on: clientOnMock,
    get: clientGetMock,
    subscribe: clientSubscribeMock
  })
}))

import ReduxRedisPersist from './redisService'

test('ReduxRedisPersist', () => {
  const reduxRedis = new ReduxRedisPersist({
    publishTo: [ 'reducerOne', 'reducerTwo' ],
    subscribeTo: [ 'reducerThree', 'reducerFour' ]
  })
  expect(clientOnMock).toBeCalled()

  const reducerMock = jest.fn()
  reducerMock.mockReturnValue({ thenExecuted: true })
  const persistReducer = reduxRedis.persistentReducer(reducerMock, { name: 'reducerThree' })
  expect(clientGetMock).toBeCalled()
  expect(clientSubscribeMock).toBeCalledWith('__keyspace@0__:reducerThree')

  const actionTrued = { type: 'SET_REDUCER', reducer: 'reducerThree', state: { foo: 'bar' } }
  const actionFalsed = { type: 'SET_REDUCER', reducer: 'reducerSome', state: { foo: 'baz' } }
  persistReducer({}, actionTrued)
  persistReducer({}, actionFalsed)
  expect(reducerMock).toBeCalledWith({}, actionTrued)
  console.log(reducerMock.mock.calls)
})
