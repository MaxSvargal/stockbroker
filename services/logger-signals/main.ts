import { Subscriber, Requester } from 'cote'

type Main = (exitProcess: Function, subscriber: Subscriber, preserver: Requester) => void
const main: Main = (exitProcess, subscriber, preserver) => {
  type NewSignalPayload = { symbol: string, type: 'BUY' | 'SELL', price: string, time: number }
  const onNewSignal = ({ symbol, type, price, time }: NewSignalPayload) => preserver.send({
    type: 'cacheHashSet',
    key: `logs:signals:${symbol}`,
    field: time,
    value: JSON.stringify({ time: new Date(time).toLocaleString(), type, price })
  })
  subscriber.on('newSignal', onNewSignal)
}

export default main
