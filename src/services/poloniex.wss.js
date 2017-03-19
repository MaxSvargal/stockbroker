import autobahn from 'autobahn'

export default () => new Promise((resolve, reject) => {
  const connection = new autobahn.Connection({
    url: 'wss://api.poloniex.com',
    realm: 'realm1',
    use_es6_promises: true,
    retry_delay_jitter: 1
  })
  connection.onopen = resolve
  connection.onclose = reject
  connection.open()
})
