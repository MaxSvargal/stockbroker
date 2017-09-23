import { Connection } from 'autobahn'

interface CrossbarService {
  url: string,
  realm: string,
  authid: string,
  authmethods: string[],
  onclose: (reason: string, details: any) => boolean,
  onchallenge: () => void
}

export default ({ url, realm, authid, authmethods, onclose, onchallenge}: CrossbarService) =>
  new Promise(resolve => {
    const options = Object.assign({ use_es6_promises: true }, {
      url, realm, authid, authmethods, onchallenge,
    })
    const connection = new Connection(options)

    connection.onopen = resolve
    connection.onclose = onclose
    connection.open()
  })
