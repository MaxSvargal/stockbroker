import { Component } from 'react'
import { hh, div } from 'react-hyperscript-helpers'

// import BigTable from 'components/BigTable'
import BotLog from 'components/BotLog'
import TradeTable from 'components/TradeTable'
import CurrencyStats from 'components/CurrencyStats'

class FullMode extends Component {
  render() {
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      div({ style: styles.column }, [
        div({ style: styles.currency }, [
          CurrencyStats(),
          div({ style: styles.botLogBox }, [
            BotLog()
          ])
        ]),
        div({ style: styles.trade }, [
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
      column: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '1vh 2.5vw'
      },
      currency: {
        minWidth: '40vw'
      },
      trade: {
        minWidth: '35vw',
        maxWidth: '100vw',
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '1rem'
      },
      botLogBox: {
        minWidth: '42vw',
        maxWidth: '55vw',
        height: 'calc(83vh - 345px)',
        overflow: 'scroll'
      }
    }
  }
}

export default hh(FullMode)
