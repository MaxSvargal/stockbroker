import { Component } from 'react'
import { connect } from 'react-redux'
import { hh } from 'react-hyperscript-helpers'

import Chart from './Chart'

class BalancePieChart extends Component {
  render() {
    const { balanceValues, currency } = this.props
    const freeBuyValue = balanceValues.availableBuyValue / currency.last

    const data = {
      labels: [
        'Свободная валюта на покупку (BTC -> ETH)',
        'Свободная валюта на продажу (ETH)',
        'В чанках на покупку',
        'В чанках на продажу'
      ],
      datasets: [
        {
          data: [
            freeBuyValue,
            balanceValues.availableSellValue,
            balanceValues.chunksBuyVolume,
            balanceValues.chunksSellVolume
          ],
          borderWidth: 0,
          hoverBorderWidth: 2,
          backgroundColor: [
            '#4da775',
            '#de6a70',
            '#66aeec',
            '#cf9a66'
          ]
        }
      ]
    }

    return Chart({ type: 'pie', data })
  }
}

const mapStateToProps = ({ balanceValues, currencies, currentPair }) =>
  ({ balanceValues, currency: currencies[currentPair] })
export default hh(connect(mapStateToProps)(BalancePieChart))
