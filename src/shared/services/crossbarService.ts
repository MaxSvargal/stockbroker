import { Connection, Session } from 'autobahn'

interface CrossbarService {
  realm: string,
  onclose: (reason: string, details: any) => boolean
}

export default ({ realm, onclose }: CrossbarService) =>
  new Promise((resolve: (session: Session, details: any) => void) => {
    const connection = new Connection({
      realm,
      authid: 'worker',
      authmethods: [ 'ticket' ],
      onchallenge: () => 'nHyRzIpW37YnHq$1L',
      url: 'ws://localhost:9000',
      use_es6_promises: true,
    })

    connection.onopen = resolve
    connection.onclose = onclose
    connection.open()
  })
