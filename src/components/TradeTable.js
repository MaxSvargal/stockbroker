import { Component } from 'react'
import { connect } from 'react-redux'
import { hh } from 'react-hyperscript-helpers'
import Table from 'components/table'

class TradeTable extends Component {
  render() {
    return Table({
      data: this.props.data,
      headers: [ 'Date', 'Price USDT', 'Amount ETH', 'Total USDT' ]
    })
  }
}

const mapStateToProps = ({ buy, sell }) => ({
  data: [
    ...sell.map(v => (Object.defineProperty(v, 'type', { value: 'sell', enumerable: false }))),
    ...buy.map(v => (Object.defineProperty(v, 'type', { value: 'buy', enumerable: false })))
  ].sort().reverse()
})

export default hh(connect(mapStateToProps)(TradeTable))
