import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'
import { formatDate } from 'client/utils'

const checkStringContain = (input, arr) =>
  arr.reduce((prev, curr) => (prev === true || input.search(curr) !== -1), false)

class BotLog extends Component {
  render() {
    const { data, textColor } = this.props
    const styles = this.getStyles()

    return div({ style: styles.root }, data.map((item, index) =>
      div({ style: styles.item(index, item[1], textColor) }, `${formatDate(item[0])} ${item[1]}`)))
  }

  getStyles() {
    return {
      root: {
        fontSize: '1.1rem',
        lineHeight: '1.4rem',
      },
      item: (index, str, textColor) => ({
        lineHeight: '2rem',
        padding: '.5rem 1rem',
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
  ({ data: botMessages.slice(botMessages.length - 500, botMessages.length).reverse() })

export default hh(connect(mapStateToProps)(BotLog))
