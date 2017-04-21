import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'

class FinalCurrentResult extends Component {
  render() {
    const { statsDynamicsTotal: { buyDynTotal, sellDynTotal } } = this.props

    const isBuyPositive = buyDynTotal >= 0
    const isSellPositive = sellDynTotal >= 0
    const charsBuy = [ ...new Array(Math.abs(buyDynTotal / 2)) ]
    const charsSell = [ ...new Array(Math.abs(sellDynTotal / 2)) ]
    const styles = this.getStyles()

    return buyDynTotal && sellDynTotal && div({ style: styles.root }, [
      div({ style: styles.child }, charsBuy.map((v, i) =>
        div({ style: styles.char(isBuyPositive, i) }, isBuyPositive ? '▲' : '▼'))),

      div({ style: styles.child }, charsSell.map((v, i) =>
        div({ style: styles.char(isSellPositive, i) }, isSellPositive ? '▲' : '▼')))
    ])
  }

  getStyles() {
    return {
      root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        margin: '-1.6rem 0 0 1rem',
        paddingTop: '0.15rem',
        height: '2rem'
      },
      child: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 .5rem'
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

const mapStateToProps = ({ statsDynamicsTotal }) => ({ statsDynamicsTotal })
export default hh(connect(mapStateToProps)(FinalCurrentResult))
