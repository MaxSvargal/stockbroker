import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'

class SimpleRate extends Component {
  render() {
    const { currency } = this.props
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      div({ style: styles.last }, currency && currency.last)
    ])
  }

  getStyles() {
    return {
      root: {
        minWidth: '100%',
        textAlign: 'center'
      },
      last: {
        fontSize: '6rem',
        lineHeight: '3rem',
        margin: '0 0 3rem 0',
        color: '#e352c9'
      }
    }
  }
}

const mapStateToProps = ({ currencies, currentPair }) =>
  ({ currency: currencies[currentPair] })

export default hh(connect(mapStateToProps)(SimpleRate))
