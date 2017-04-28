import test from 'ava'
import { stats } from 'shared/reducers/stats'
import { addStats } from 'shared/actions'

test('stats < addStats should add initial stat', t => {
  const state = []
  const stat = { created: 0, last: 1, lowestAsk: 2, highestBid: 3, buyChange: 4, sellChange: 5 }
  const action = addStats(stat)
  const newState = stats(state, action)
  t.deepEqual(newState, [ stat ])
})

test('stats < addStats should update prev stat when it fall within the time interval', t => {
  const prevTime = 1493393197675
  const currTime = prevTime + 5000 // add 5 seconds
  const state = [ { created: prevTime, last: 1, lowestAsk: 2, highestBid: 3, buyChange: 4, sellChange: 5 } ]
  const newStat = { created: currTime, last: 11, lowestAsk: 12, highestBid: 13, buyChange: 14, sellChange: 15 }
  const action = addStats(newStat)
  const newState = stats(state, action)

  t.is(newState.length, 1)
  t.deepEqual(newState, [ Object.assign({}, newStat, { created: prevTime }) ])
})

test('stats < addStats should add new stat when it does not fall within the time interval', t => {
  const prevTime = 1493393197675
  const currTime = prevTime + (1000 * 60 * 6) // more then 5 minutes
  const state = [ { created: prevTime, last: 1, lowestAsk: 2, highestBid: 3, buyChange: 4, sellChange: 5 } ]
  const newStat = { created: currTime, last: 11, lowestAsk: 12, highestBid: 13, buyChange: 14, sellChange: 15 }
  const action = addStats(newStat)
  const newState = stats(state, action)

  t.is(newState.length, 2)
  t.deepEqual(newState, [ state[0], newStat ])
})
