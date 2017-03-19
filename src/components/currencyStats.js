import { Component } from 'react'
import { hh, div } from 'react-hyperscript-helpers'

class CurrencyStats extends Component {
  render() {
    const { data } = this.props

    return data ? div([
      div([ 'Курс: ', data.last ]),
      div([ 'Спрос: ', data.lowestAsk ]),
      div([ 'Предложение: ', data.highestBid ]),
      div([ 'Высшая цена за 24 часа: ', data.hrHigh ]),
      div([ 'Низшая цена за 24 часа: ', data.hrLow ]),
      div([ 'Сдвиг: ', data.percentChange, '%' ]),
      div([ 'Объём: ', data.baseVolume ])
    ]) : div('Загрузка...')
  }
}

export default hh(CurrencyStats)
