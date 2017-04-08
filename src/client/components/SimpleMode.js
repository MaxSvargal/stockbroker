import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'

import BotLog from './BotLog'

class SimpleMode extends Component {
  render() {
    const { statsResult, currentPair, currency } = this.props
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      div({ style: styles.bgIndicator(statsResult) }),
      div({ style: styles.content }, [
        div({ style: styles.pair }, currentPair),
        div({ style: styles.rate }, currency && currency.last),
        div({ style: styles.botLogBox }, [
          BotLog({ textColor: '#fff' })
        ])
      ])
    ])
  }

  getStyles() {
    return {
      root: {
        padding: '3vh 5vw',
        height: 'calc(100vh - 43px)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative'
      },
      content: {
        position: 'relative',
        zIndex: 2
      },
      botLogBox: {
        display: 'flex',
        justifyContent: 'center',
        minWidth: '80vw',
        maxWidth: '90vw',
        height: '60vh',
        overflowY: 'scroll'
      },
      bgIndicator: state => ({
        position: 'absolute',
        zIndex: 1,
        left: 0,
        width: '100vw',
        height: '200vh',
        transition: 'top 5s',
        top: `${(state * 5) - 68}%`,
        background: 'linear-gradient(#ffaf7b, #d76d77, #3a1c71)'
      }),
      rate: {
        fontSize: '7rem',
        lineHeight: '3rem',
        margin: '3rem 0 5rem 0',
        textAlign: 'center',
        transition: 'color 5s ease-in',
        color: '#fff'
      },
      pair: {
        textAlign: 'center',
        fontSize: '2rem',
        margin: 0,
        fontWeight: 'bold'
      }
    }
  }
}

const mapStateToProps = ({ statsResult, currencies, currentPair }) =>
  ({ statsResult, currentPair, currency: currencies[currentPair] })

export default hh(connect(mapStateToProps)(SimpleMode))
