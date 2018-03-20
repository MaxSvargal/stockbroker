import React, { Component } from 'react'
import Link from 'next/link'
import { rehydrate, css } from 'glamor'
import glamorous from 'glamorous'

import Balance from './components/balance'
import CandlesChart from './components/candlesChart'
import Menu from './components/menu'
import PositionsOpenList from './components/positionsOpenList'
import PositionsTimeline from './components/positionsTimeline'
import ProfitLine from './components/profitLine'
import ProfitWaterfall from './components/profitWaterfall'
import Toggler from './components/toggler'

if (typeof window !== 'undefined') rehydrate(window.__NEXT_DATA__.ids)

export default class extends Component {
  state = { loaded: false }

  static async getInitialProps ({ query: { positions, profile } }) {
    if (positions && profile) return { positions, profile }

    const reqs = await Promise.all([
      fetch(`${location.origin}/api/positions`),
      fetch(`${location.origin}/api/profile`)
    ])
    const [ posJson, profJson ] = await Promise.all(reqs.map(v => v.json()))
    return { positions: posJson, profile: profJson }
  }

  componentDidMount() { this.setState({ loaded: true }) }

  render() {
    const { positions, profile } = this.props
    
    css.global('html, body', {
      background: '#fff',
      margin: 0,
      height: '100vh',
      minHeight: '100vh',
      fontFamily: '"SFMono-Regular",Consolas,"Liberation Mono",Menlo,Courier,monospace',
      fontSize: '14px'
    })

    const Container = glamorous.div({
      height: '100vh',
      display: 'grid',
      grid: '25vh 1fr / 5rem 1fr 1fr',
      gridTemplateAreas: `
        "sidebar header1 header2"
        "sidebar main main"
        "sidebar footer footer"
      `
    })

    const HeaderBalance = glamorous.div({ gridArea: 'header1' })
    const HeaderGraph = glamorous.div({ gridArea: 'header2', overflow: 'hidden' })
    const MainPositions = glamorous.div({ gridArea: 'main' })

    return !this.state.loaded ? <div/> : (
      <Container>
        <Menu />
        <HeaderBalance>
          <Balance positions={ positions } chunksNumber={ profile && profile.preferences.chunksNumber } />
        </HeaderBalance>
        <HeaderGraph>
          <Toggler>
            <ProfitWaterfall positions={ positions } />
            <ProfitLine positions={ positions } />
          </Toggler>
        </HeaderGraph>
        <MainPositions>
          <PositionsOpenList positions={ positions } />
        </MainPositions>
      </Container>
    )
  }
}
