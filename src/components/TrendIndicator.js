import { Component } from 'react'
import { hh, h1, div } from 'react-hyperscript-helpers'

class TradeIndicator extends Component {
  render() {
    const { data } = this.props
    const styles = this.getStyles()

    return data ? div({ style: styles.root }, [
      h1({ style: styles.h1 }, [ 'USDT_ETH' ]),
      div([ 'Курс: ', data.last ]),
      div([ 'Спрос: ', data.lowestAsk ]),
      div([ 'Предложение: ', data.highestBid ]),
      div([ 'Высшая цена за 24 часа: ', data.hrHigh ]),
      div([ 'Низшая цена за 24 часа: ', data.hrLow ]),
      div([ 'Сдвиг: ', data.percentChange, '%' ]),
      div([ 'Объём: ', data.baseVolume ])
    ]) : div('Загрузка...')
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

export default hh(TradeIndicator)
