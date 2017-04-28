import { Component } from 'react'
import { connect } from 'react-redux'
import { h, hh, div } from 'react-hyperscript-helpers'
import { Scrollbars } from 'react-custom-scrollbars'
import { formatDate } from '../../shared/utils'

const checkStringContain = (input, arr) =>
  arr.reduce((prev, curr) => (prev === true || input.search(curr) !== -1), false)

class BotLog extends Component {
  render() {
    const { data, textColor } = this.props
    const styles = this.getStyles()

    console.log({ data })
    /*
    `Куплено за ${rate}, покрыто ${covered.rate}, объём ${covered.amount}, прибыль ${profit}`
    `Покупка не удалась. Ошибка: ${response.failure.payload.error}`
    `Продажа за ${rateWithHold} не покрывает ни одной покупки`
    `Продано за ${rate}, покрыто ${covered.rate}, объём ${covered.amount}, прибыль: ${profit}`
    `Продажа не удалась. Ошибка: ${response.failure.payload.error}`
    `Покупка за ${rateWithHold} не покрывает ни одной продажи`
    `Созданы ${type === 'buy' ? 'покупки' : 'продажи'} за ${rate} в количестве ${num} частей по ${amount} ${currency}`
    `Чанки в количестве ${obsoleteTransactions.length} шт. инвалидированы`
    */

    return h(Scrollbars, [
      div({ style: styles.root }, data.map((item, index) =>
        div({ style: styles.item(index, item[1], textColor) }, `${formatDate(item[0])} ${item[1]}`)))
    ])
  }

  getStyles() {
    return {
      root: {
        lineHeight: '1.34rem',
        overflow: 'scroll-y'
      },
      item: (index, str, textColor) => ({
        lineHeight: '2rem',
        padding: '.25rem 1rem',
        borderTop: '1px solid rgba(0, 0, 0, .25)',
        background: index % 2 ? 'transparent' : 'rgba(0, 0, 0, .15)',
        fontWeight: checkStringContain(str, [ 'Куплено', 'Продано', 'Ошибка' ]) ? 'bold' : 'normal',
        color: textColor ||
          (str.search('Куплено') !== -1 && '#97c47e') ||
          (str.search('Продано') !== -1 && '#de6a76') ||
          (str.search('Ошибка') !== -1 && '#ef3435') ||
          '#fff'
      })
    }
  }
}

const mapStateToProps = ({ messages }) => ({ data: messages.reverse() })

export default hh(connect(mapStateToProps)(BotLog))
