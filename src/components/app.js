import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'

import BigTable from 'components/BigTable'
import TradeTable from 'components/TradeTable'
import Table from 'components/table'
import CurrencyStats from 'components/CurrencyStats'

class App extends Component {
  render() {
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      div( { style: styles.row }, [
        div({ style: styles.currency }, [
          CurrencyStats()
        ]),
        div({ style:  styles.trade }, [
          TradeTable()
        ])
      ]),
      div({ style: styles.row }, [
        BigTable(({ ask }) => ({ data: ask }))
          ({ title: 'Спрос', headers: [ 'Date', 'Price', 'ETH', 'USDT' ] }),
        BigTable(({ bid }) => ({ data: bid }))
          ({ title: 'Предложение', headers: [ 'Date', 'Price', 'ETH', 'USDT' ] })
      ])
    ])
  }

  getStyles() {
    return {
      root: {
        background: '#08151a',
        color: '#fff',
        fontFamily: '"Courier New", monospace',
        fontSize: '16px',
        height: '98vh',
        overflow: 'hidden',
        padding: '2.5vh 2.5vw',
        WebkitFontSmoothing: 'antialiased'
      },
      row: {
        display: 'flex',
        margin: '1rem 0 3rem 0',
        justifyContent: 'space-around'
      },
      currency: {
        minWidth: '40vw'
      },
      trade: {
        minWidth: '40vw',
        maxWidth: '100vw',
        display: 'flex',
        justifyContent: 'center'
      }
    }
  }
}

export default hh(App)
