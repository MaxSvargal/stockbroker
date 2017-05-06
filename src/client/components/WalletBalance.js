import { Component } from 'react'
import { connect } from 'react-redux'
import { hh } from 'react-hyperscript-helpers'

import Chart from './Chart'

class WalletBalance extends Component {
  render() {
    const { currency, wallet, currentPair } = this.props
    const [ sourceCurrency, purposeCurrency ] = currentPair.split('_')
    const sourceValue = wallet[sourceCurrency]
    const purposeInSourceValue = wallet[purposeCurrency] * currency.last

    const data = {
      labels: [ sourceCurrency, `${purposeCurrency} => ${sourceCurrency}` ],
      datasets: [
        {
          data: [ sourceValue, purposeInSourceValue ],
          borderWidth: 0,
          hoverBorderWidth: 2,
          backgroundColor: [
            '#66aeec',
            '#cf9a66'
          ]
        }
      ]
    }

    return Chart({ type: 'pie', data })
  }
}

const mapStateToProps = ({ wallet, currencies, currentPair }) =>
  ({ currency: currencies[currentPair], wallet: wallet[wallet.length - 1][1], currentPair })
export default hh(connect(mapStateToProps)(WalletBalance))
