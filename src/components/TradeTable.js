import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, h1, div } from 'react-hyperscript-helpers'
import Table from 'components/table'

const limit = (arr, lim) => [ ...arr.slice(0, lim) ]
const summ = v => [ ...v, (v[1] * v[2]).toFixed(2) ]

class TradeTable extends Component {
  render() {
    const { data } = this.props
    const styles = this.getStyles()

    return Table({
      data: data,
      title: 'История',
      headers: [ 'Date', 'Price USDT', 'Amount ETH', 'Total USDT' ]
    })
  }

  getStyles() {
    return {
      root: {
        lineHeight: '1.8rem',
        fontWeight: 'bold'
      },
      h1: {
        fontSize: '3rem'
      }
    }
  }
}

const mapStateToProps = ({ buy, sell }) => ({
  data: [
    ...sell.map(v => (Object.defineProperty(v, 'type', { value: 'sell', enumerable: false }))),
    ...buy.map(v => (Object.defineProperty(v, 'type', { value: 'buy', enumerable: false })))
  ].sort().reverse()
})

export default hh(connect(mapStateToProps)(TradeTable))
