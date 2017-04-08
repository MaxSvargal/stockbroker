import { Component } from 'react'
import { connect } from 'react-redux'
import { hh, div } from 'react-hyperscript-helpers'

import BotLog from './BotLog'

class SimpleMode extends Component {
  render() {
    const { statsResult, currency } = this.props
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      div({ style: styles.bgIndicator(statsResult) }),
      div({ style: styles.content }, [
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
        padding: '5vh 5vw'
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
      bgIndicator: result => ({
        position: 'absolute',
        zIndex: 1,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        transition: 'background 5s ease-in',
        background: (() =>
          (result === -10 && '#4a8fdf') ||
          (result === -8 && '#508edd') ||
          (result === -6 && '#5e8bd9') ||
          (result === -4 && '#6c89d5') ||
          (result === -2 && '#7c85d0') ||
          (result === 0 && '#8f81ca') ||
          (result === 2 && '#a07ec4') ||
          (result === 4 && '#b27abf') ||
          (result === 6 && '#c177ba') ||
          (result === 8 && '#c875b8') ||
          (result === 10 && '#d573b4'))()
      }),
      rate: {
        fontSize: '7rem',
        lineHeight: '3rem',
        margin: '3rem 0 5rem 0',
        textAlign: 'center',
        transition: 'color 5s ease-in',
        color: '#fff'
      }
    }
  }
}

const mapStateToProps = ({ statsResult, currencies, currentPair }) =>
  ({ statsResult, currency: currencies[currentPair] })

export default hh(connect(mapStateToProps)(SimpleMode))
