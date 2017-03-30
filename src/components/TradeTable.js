import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'
import Table from 'components/Table'

class TradeTable extends Component {
  render() {
    return div({ style: { overflowY: 'scroll', height: '87vh' } }, [
      Table({
        data: this.props.data,
        headers: [ 'Date', 'Price USDT', 'Amount ETH', 'Total USDT' ]
      })
    ])
  }
}

const mapStateToProps = ({ buy, sell }) => {
  const partOfSells = sell
    .slice(sell.length - 150, sell.length - 1)
    .map(v => Object.defineProperty(v, 'type', { value: 'sell', enumerable: false }))

  const partOfBuys = buy
    .slice(buy.length - 150, buy.length - 1)
    .map(v => Object.defineProperty(v, 'type', { value: 'buy', enumerable: false }))

  const mergedArrays = [ ...partOfSells, ...partOfBuys ].sort().reverse()

  return { data: mergedArrays }
}

export default hh(connect(mapStateToProps)(TradeTable))
