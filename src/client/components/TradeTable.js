import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'
import Table from './Table'

class TradeTable extends Component {
  render() {
    const { data, currentPair } = this.props
    const pairNames = currentPair.split('_')

    return div({ style: { overflowY: 'scroll', height: '87vh' } }, [
      Table({ data, headers: [ 'Date', `Price ${pairNames[0]}`, `Amount ${pairNames[1]}`, `Total ${pairNames[0]}` ] })
    ])
  }
}

const mapStateToProps = ({ buy, sell, currentPair }) => {
  const partOfSells = sell
    .slice(sell.length - 150, sell.length - 1)
    .map(v => Object.defineProperty(v, 'type', { value: 'sell', enumerable: false }))

  const partOfBuys = buy
    .slice(buy.length - 150, buy.length - 1)
    .map(v => Object.defineProperty(v, 'type', { value: 'buy', enumerable: false }))

  const mergedArrays = [ ...partOfSells, ...partOfBuys ].sort().reverse()

  return { data: mergedArrays, currentPair }
}

export default hh(connect(mapStateToProps)(TradeTable))
