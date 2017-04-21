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

const mapStateToProps = ({ botMessages }) =>
  ({ data: botMessages.slice(botMessages.length - 5000, botMessages.length).reverse() })

export default hh(connect(mapStateToProps)(BotLog))
