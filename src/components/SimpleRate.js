import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'
import { CURRENT_PAIR } from 'const'

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
        fontSize: '4.5rem',
        lineHeight: '3rem',
        margin: '1rem 0 2.5rem 0',
        color: '#e352c9'
      }
    }
  }
}

const mapStateToProps = ({ currencies }) =>
  ({ currency: currencies[CURRENT_PAIR] })

export default hh(connect(mapStateToProps)(SimpleRate))
