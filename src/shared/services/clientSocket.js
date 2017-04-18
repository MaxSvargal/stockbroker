import { Connection } from 'autobahn'

const { NODE_ENV } = process.env

export default realm => new Promise((resolve, reject) => {
  const connection = new Connection({
    realm,
    url: NODE_ENV === 'development' ?
      'ws://localhost:8080/ws' :
      'ws://fuckers.tech:8080/ws',
    use_es6_promises: true,
    retry_delay_jitter: 1
  })
  connection.onopen = resolve
  connection.onclose = reject
  connection.open()
})
