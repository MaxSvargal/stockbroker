import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'
import { formatDate } from 'helpers'

class BotLog extends Component {
  render() {
    const { data } = this.props
    const styles = this.getStyles()

    return div({ style: styles.root }, data.reverse().slice(0, 200).map(item =>
      div(`${formatDate(item[0])} ${item[1]}`)))
  }

  getStyles() {
    return {
      root: {
        fontSize: '1.1rem',
        lineHeight: '1.4rem',
        maxWidth: '60vw',
        height: '30vh',
        overflow: 'scroll'
      }
    }
  }
}

const mapStateToProps = ({ botMessages }) =>
  ({ data: botMessages })

export default hh(connect(mapStateToProps)(BotLog))
