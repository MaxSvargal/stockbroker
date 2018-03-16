import React, { Component } from 'react'

import ProfitWaterfall from './components/profitWaterfall'
import ProfitLine from './components/profitLine'
import PositionsTimeline from './components/positionsTimeline'
import PositionsOpenList from './components/positionsOpenList'

export default class extends Component {
  static getInitialProps = async ({ query: { positions } }) => ({ positions })
  state = { loaded: false }
  componentDidMount() { this.setState({ loaded: true }) }

  render() {
    const { positions } = this.props
    const styles = this.getStyles()

    return !this.state.loaded ? <div/> : (
      <div style={ styles.root } >
        <PositionsOpenList positions={ positions } />
        <div style={ styles.row } >
          <ProfitWaterfall positions={ positions } />
          <ProfitLine positions={ positions } />
        </div>
        <PositionsTimeline positions={ positions } />
      </div>
    )
  }

  getStyles() {
    return {
      root: {
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"SFMono-Regular",Consolas,"Liberation Mono",Menlo,Courier,monospace'
      },
      row: {
        display: 'flex',
        clexDirection: 'row'
      }
    }
  }
}
