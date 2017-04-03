import { Component } from 'react'
import { hh, div } from 'react-hyperscript-helpers'

import BotLog from './BotLog'
import SimpleRate from './SimpleRate'

class FullMode extends Component {
  render() {
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      SimpleRate(),
      div({ style: styles.botLogBox }, [
        BotLog()
      ])
    ])
  }

  getStyles() {
    return {
      root: {
        padding: '5vh 5vw'
      },
      botLogBox: {
        display: 'flex',
        justifyContent: 'center',
        minWidth: '80vw',
        maxWidth: '90vw',
        height: '75vh',
        overflowY: 'scroll'
      }
    }
  }
}

export default hh(FullMode)
