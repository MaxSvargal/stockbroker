import { Connection } from 'autobahn'

interface autobahnInterface {
  realm: string,
  onclose: (reason: string, details: any) => boolean
}

export default ({ realm, onclose }: autobahnInterface) =>
  new Promise(resolve => {
    const connection = new Connection({
      url: 'ws://localhost:9000',
      use_es6_promises: true,
      authmethods: [ 'ticket' ],
      authid: 'worker',
      onchallenge: () => 'nHyRzIpW37YnHq$1L',
      realm
    })

    connection.onopen = resolve
    connection.onclose = onclose
  })
