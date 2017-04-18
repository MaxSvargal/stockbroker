import { Connection } from 'autobahn'

export default () => new Promise((resolve, reject) => {
  const connection = new Connection({
    // get url and connect to separated socket?
    url: 'ws://localhost:8080/ws',
    realm: 'me/btc/eth',
    use_es6_promises: true,
    retry_delay_jitter: 1
  })
  connection.onopen = resolve
  connection.onclose = reject
  connection.open()
})
