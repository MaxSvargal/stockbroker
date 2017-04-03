import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'

class FinalCurrentResult extends Component {
  render() {
    const { finalCurrentResult } = this.props
    const isPositive = finalCurrentResult >= 0
    const chars = [ ...new Array(Math.abs(finalCurrentResult / 2)) ]
    const styles = this.getStyles()

    return div({ style: styles.root },
      chars.map((v, i) => div({ style: styles.char(isPositive, i) }, isPositive ? '▲' : '▼')))
  }

  getStyles() {
    return {
      root: {
        position: 'absolute',
        marginLeft: '14rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '0.15rem',
        height: '2rem'
      },
      char: (isPositive, index) => ({
        color: isPositive ? `#72bf${index * 2}d` : `#c349${index * 2}a`,
        fontSize: '1.75rem',
        marginTop: '-1rem',
        alignSelf: 'center'
      })
    }
  }
}

const mapStateToProps = ({ finalCurrentResult }) => ({ finalCurrentResult })
export default hh(connect(mapStateToProps)(FinalCurrentResult))
