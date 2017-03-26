import { Component } from 'react'
import { hh, div } from 'react-hyperscript-helpers'

// import BigTable from 'components/BigTable'
import BotLog from 'components/BotLog'
import TradeTable from 'components/TradeTable'
import CurrencyStats from 'components/CurrencyStats'
import ChunksConvertInformator from 'components/ChunksConvertInformator'
// import ClearDbBtn from 'components/ClearDbBtn'

class App extends Component {
  render() {
    const styles = this.getStyles()

    // toggle between minimal and full mode interface

    return div({ style: styles.root }, [
      ChunksConvertInformator(),
      div({ style: styles.column }, [
        div({ style: styles.currency }, [
          CurrencyStats(),
          BotLog()
        ]),
        div({ style: styles.trade }, [
          TradeTable(),
          // ClearDbBtn()
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
        background: '#282c34',
        color: '#fff',
        fontFamily: '"Courier New", monospace',
        fontSize: '16px',
        minHeight: '100vh',
        WebkitFontSmoothing: 'antialiased'
      },
      row: {
        display: 'flex',
        margin: '1rem 0 3rem 0',
        justifyContent: 'space-around',
        padding: '2.5vh 2.5vw'
      },
      column: {
        display: 'flex',
        padding: '2.5vh 2.5vw'
      },
      currency: {
        minWidth: '40vw'
      },
      trade: {
        minWidth: '35vw',
        maxWidth: '100vw',
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }
  }
}

export default hh(App)
