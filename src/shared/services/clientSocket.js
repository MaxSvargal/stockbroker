import { Connection } from 'autobahn'

export default () => new Promise((resolve, reject) => {
  const connection = new Connection({
    url: 'ws://localhost:8080/ws',
    realm: 'realm1',
    use_es6_promises: true,
    retry_delay_jitter: 1
  })
  connection.onopen = resolve
  connection.onclose = reject
  connection.open()
})
