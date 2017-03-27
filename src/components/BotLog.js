import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'
import { formatDate } from 'helpers'

const checkStringContain = (input, arr) =>
  arr.reduce((prev, curr) => (prev === true || input.search(curr) !== -1), false)

class BotLog extends Component {
  render() {
    const { data } = this.props
    const styles = this.getStyles()

    return div({ style: styles.root }, data.map((item, index) =>
      div({ style: styles.item(index, item[1]) }, `${formatDate(item[0])} ${item[1]}`)))
  }

  getStyles() {
    return {
      root: {
        fontSize: '1.1rem',
        lineHeight: '1.4rem',
        // minWidth: '45vw',
        // maxWidth: '55vw',
        // height: '43.5vh',
        // overflow: 'scroll'
      },
      item: (index, str) => ({
        padding: '.25rem 0',
        borderBottom: '1px solid #3b4048',
        background: index % 2 ? 'transparent' : '#343940',
        fontWeight: checkStringContain(str, [ 'Куплено', 'Продано', 'Ошибка' ]) ? 'bold' : 'normal',
        color: (str.search('Куплено') !== -1 && '#f8fcf5') ||
          (str.search('Продано') !== -1 && '#fcf7f5') ||
          (str.search('Ошибка') !== -1 && '#ef3435') ||
          '#fff'
      })
    }
  }
}

const mapStateToProps = ({ botMessages }) =>
  ({ data: botMessages.slice().reverse().slice(0, 200) })

export default hh(connect(mapStateToProps)(BotLog))
