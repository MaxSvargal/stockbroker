import React, { Component } from 'react'
import { rehydrate, css } from 'glamor'
import glamorous from 'glamorous'

import Balance from './components/balance'
import Menu from './components/menu'
import PositionsOpenList from './components/positionsOpenList'
import SymbolsStates from './components/symbolsStates'

if (typeof window !== 'undefined') rehydrate(window.__NEXT_DATA__.ids)

export default class extends Component {
  state = { loaded: false }

  static async getInitialProps ({ query }) {
    if (query.positions) return query

    const reqs = await Promise.all([
      fetch(`${location.origin}/api/positions`),
      fetch(`${location.origin}/api/profile`),
      fetch(`${location.origin}/api/symbolsState`)
    ])
    const [ positions, profile, symbolsState ] = await Promise.all(reqs.map(v => v.json()))
    return { positions, profile, symbolsState }
  }

  componentDidMount() { this.setState({ loaded: true }) }

  render() {
    const { positions, profile, symbolsState } = this.props
    
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
      grid: '30vh 70vh / 5rem 1fr',
      gridTemplateAreas: `
        "sidebar header header"
        "sidebar main main"
        "sidebar footer footer"
      `,
      '@media(max-width: 600px)': {
        grid: '5rem / 1fr',
        gridTemplateAreas: `
          "sidebar"
          "header"
          "main"
          "footer"
        `
      }
    })

    const Header = glamorous.div({ gridArea: 'header' })
    const Main = glamorous.div({ gridArea: 'main', height: '70vh', overflow: 'scroll' })
    const Sidebar = glamorous.div({ gridArea: 'sidebar', alignSelf: 'end' })

    return !this.state.loaded ? <div/> : (
      <Container>
        <Menu />
        <Sidebar>
          <SymbolsStates data={ symbolsState } />
        </Sidebar>
        <Header>
          <Balance positions={ positions } profile={ profile } />
        </Header>
        <Main>
          <PositionsOpenList positions={ positions } />
        </Main>
      </Container>
    )
  }
}
