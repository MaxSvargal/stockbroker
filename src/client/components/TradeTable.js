import { Component } from 'react'
import { connect } from 'react-redux'
import { hh } from 'react-hyperscript-helpers'
import Table from './Table'

class TradeTable extends Component {
  render() {
    const { data, currentPair } = this.props
    const pairNames = currentPair.split('_')
    return Table({ data, headers: [ 'Date', `Price ${pairNames[0]}`, `Amount ${pairNames[1]}`, `Total ${pairNames[0]}` ] })
  }
}

const mapStateToProps = ({ buy, sell, currentPair }) => {
  const partOfSells = sell
    .slice(sell.length - 250, sell.length - 1)
    .map(v => Object.defineProperty(v, 'type', { value: 'sell', enumerable: false }))

  const partOfBuys = buy
    .slice(buy.length - 250, buy.length - 1)
    .map(v => Object.defineProperty(v, 'type', { value: 'buy', enumerable: false }))

  const mergedArrays = [ ...partOfSells, ...partOfBuys ].sort().reverse()

  return { data: mergedArrays, currentPair }
}

export default hh(connect(mapStateToProps)(TradeTable))
