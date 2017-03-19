import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'

import Table from 'components/table'
import CurrencyStats from 'components/currencyStats'

class App extends Component {
  render() {
    const { ask, bid, buy, sell, currency } = this.props

    return div([
      div({ style: { margin: '1rem' } }, [
        CurrencyStats({ data: currency })
      ]),
      div({ style: { display: 'flex', maxHeight: '100vh' } }, [
        Table({ data: bid.sort() }),
        Table({ data: ask.sort() }),
        Table({ data: sell }),
        Table({ data: buy})
      ])
    ])
  }
}

export default hh(connect(
  ({ ask, bid, buy, sell, currencies }) =>
    ({ ask, bid, buy, sell, currency: currencies['USDT_ETH'] })
)(App))
