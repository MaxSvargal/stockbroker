import { Component } from 'react'
import { hh, div } from 'react-hyperscript-helpers'

// import BigTable from './BigTable'
import BotLog from './BotLog'
import TradeTable from './TradeTable'
import CurrencyStats from './CurrencyStats'
import CurrencyRate from './CurrencyRate'

class FullMode extends Component {
  render() {
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      div({ style: styles.column }, [
        div({ style: styles.currency }, [
          div({ style: styles.row }, [
            CurrencyRate(),
            CurrencyStats()
          ]),
          div({ style: styles.botLogBox }, [
            BotLog()
          ])
        ]),
        div({ style: styles.tradeBox }, [
          TradeTable()
        ])
      ])
      // div({ style: styles.row }, [
      //   BigTable(({ ask }) => ({ data: ask }))(
      //     { title: 'Предложение', headers: [ 'Date', 'Price', 'ETH', 'USDT' ] }),
      //   BigTable(({ bid }) => ({ data: bid }))(
      //     { title: 'Спрос', headers: [ 'Date', 'Price', 'ETH', 'USDT' ] })
      // ])
    ])
  }

  getStyles() {
    return {
      root: {
      },
      row: {
        display: 'flex',
        justifyContent: 'space-between'
      },
      column: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: '1vh 0'
      },
      currency: {
        minWidth: '60vw',
        margin: '2rem 0'
      },
      tradeBox: {
        minWidth: '32vw',
        maxWidth: '80vw',
        marginTop: '1rem',
        overflow: 'auto',
        height: '88vh'
      },
      botLogBox: {
        minWidth: '32vw',
        maxWidth: '65vw',
        height: 'calc(85vh - 180px)',
        overflow: 'auto',
        minHeight: '30vh',
        maxHeight: '76vh'
      }
    }
  }
}

export default hh(FullMode)
