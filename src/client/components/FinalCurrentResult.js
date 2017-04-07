import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'

class FinalCurrentResult extends Component {
  render() {
    const { statsResult } = this.props
    const isPositive = statsResult >= 0
    const chars = [ ...new Array(Math.abs(statsResult / 2)) ]
    const styles = this.getStyles()

    return div({ style: styles.root },
      chars.map((v, i) => div({ style: styles.char(isPositive, i) }, isPositive ? '▲' : '▼')))
  }

  getStyles() {
    return {
      root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        margin: '-1.6rem 0 0 1rem',
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

const mapStateToProps = ({ statsResult }) => ({ statsResult })
export default hh(connect(mapStateToProps)(FinalCurrentResult))
