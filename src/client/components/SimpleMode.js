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
        div({ style: styles.rate(statsResult) }, currency && currency.last),
        div({ style: styles.botLogBox }, [
          BotLog()
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
          (result === -10 && '#3a1c71') ||
          (result === -8 && '#422071') ||
          (result === -6 && '#5e2f73') ||
          (result === -4 && '#783c73') ||
          (result === -2 && '#914974') ||
          (result === 0 && '#b35b76') ||
          (result === 2 && '#c96677') ||
          (result === 4 && '#db7477') ||
          (result === 6 && '#e68579') ||
          (result === 8 && '#ed9279') ||
          (result === 10 && '#ffaf7c'))()
      }),
      rate: result => ({
        fontSize: '7rem',
        lineHeight: '3rem',
        margin: '3rem 0 5rem 0',
        textAlign: 'center',
        transition: 'color 5s ease-in',
        color: (() =>
          (result >= 2 && '#3a1c71') ||
          (result < 2 && '#ffaf7c')
        )()
      })
    }
  }
}

const mapStateToProps = ({ statsResult, currencies, currentPair }) =>
  ({ statsResult, currency: currencies[currentPair] })

export default hh(connect(mapStateToProps)(SimpleMode))
