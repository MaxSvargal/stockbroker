import { empty } from 'most'
import { run, TestEnvironment } from 'most-test'
import pos from '../positions'

const env = new TestEnvironment()

test('pos test', async () => {
  const stream = empty()
  const { events } = await env.tick().collect(stream)
  expect(pos(stream)).toEqual({})
})
