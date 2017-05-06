import { Component } from 'react'
import { connect } from 'react-redux'
import { h, hh, div, span } from 'react-hyperscript-helpers'
import { Scrollbars } from 'react-custom-scrollbars'
import { formatDate } from '../../shared/utils'

class BotLog extends Component {

  render() {
    const styles = this.getStyles()
    return h(Scrollbars, [
      div({ style: styles.root }, this.props.data.map((msg, index) =>
        div({ style: styles.item(index) }, [
          formatDate(msg.created), ' ',
          this.getMessage(msg)
        ])
      ))
    ])
  }

  getStyles() {
    return {
      root: {
        lineHeight: '1.34rem',
        overflow: 'scroll-y'
      },
      item: index => ({
        lineHeight: '2rem',
        padding: '.25rem 1rem',
        borderTop: '1px solid rgba(0, 0, 0, .25)',
        background: index % 2 ? 'transparent' : 'rgba(0, 0, 0, .15)'
      }),
      msg: {
        transaction: {
          buy: {},
          sell: {}
        },
        failure: {
          buy: {},
          sell: {}
        },
        error: {
          buy: {},
          sell: {}
        },
        chunks: {
          created: {},
          invalidated: {}
        },
        unknown: {}
      }
    }
  }

  getMessage({ type, message }) {
    const { msg } = this.getStyles()

    switch (type) {
      case 'transaction': {
        const { action, rate, coveredRate, coveredAmount, profit } = message
        return span(
          { style: msg.transaction[action] },
          `${action === 'buy' ? 'Куплено' : 'Продано'} за ${rate}, покрыто ${coveredRate}, объём ${coveredAmount}, прибыль ${profit}`
        )
      }
      case 'failure': {
        const { action, rate } = message
        return span(
          { style: msg.failure[action] },
          `${action === 'buy' ? 'Покупка' : 'Продажа'} за ${rate} не покрывает ни одной ${action === 'buy' ? 'продажи' : 'покупки'}`
        )
      }
      case 'error': {
        const { action, error } = message
        return span(
          { style: msg.error[action] },
          `${action === 'buy' ? 'Покупка' : 'Продажа'} не удалась. Ошибка: ${error}`
        )
      }
      case 'service': {
        return span({ style: msg.service }, `Сервисное сообщение: ${message}`)
      }
      case 'chunks': {
        const { action, type: actionType, rate, amount, num } = message
        switch (action) {
          case 'created':
            return span(
              { style: msg.chunks[action] },
              `Созданы ${actionType === 'buy' ? 'покупки' : 'продажи'} за ${rate} в количестве ${num} частей по ${amount}`
            )
          case 'invalidated':
            return span(
              { style: msg.chunks[action] },
              `Чанки в количестве ${num} шт. инвалидированы`
            )
          default:
            return span(
              { style: msg.unknown },
              'Неизвестное сообщение типа chunks'
            )
        }
      }
      default:
        return span(
          { style: msg.unknown },
          `Неизвестное сообщение типа ${type} и параметрами ${JSON.stringify(message)}`
        )
    }
  }
}

const mapStateToProps = ({ messages }) =>
  ({ data: messages.sort((a, b) => b.created - a.created) })

export default hh(connect(mapStateToProps)(BotLog))
