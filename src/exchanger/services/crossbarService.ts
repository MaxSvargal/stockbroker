import { Connection } from 'autobahn'

export default ({
  url, realm, authid, authmethods, onclose, onchallenge
}) => new Promise(resolve => {
  const defaultOptions = { use_es6_promises: true }
  const options = Object.assign({}, defaultOptions, {
    url, realm, authid, authmethods, onchallenge
  })
  const connection = new Connection(options)

  connection.onopen = resolve
  connection.onclose = onclose
  connection.open()
})
