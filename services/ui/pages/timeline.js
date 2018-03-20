import React, { Component } from 'react'
import Link from 'next/link'
import { rehydrate, css } from 'glamor'
import glamorous from 'glamorous'
import fetch from 'isomorphic-fetch'

import PositionsTimeline from './components/positionsTimeline'
import Menu from './components/menu'

export default class extends Component {
  state = { loaded: false }

  static async getInitialProps ({ query: { positions } }) {
    if (positions) return { positions }

    const res = await fetch('http://localhost:3000/api/positions')
    const json = await res.json()
    return { positions: json }
  }

  componentDidMount() { this.setState({ loaded: true }) }

  render() {
    const { positions } = this.props
    
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
      grid: '1fr / 5rem 1fr',
      gridTemplateAreas: `
        "sidebar main"
      `
    })

    return (!positions || !this.state.loaded) ? <div/> : (
      <Container>
        <Menu />
        <PositionsTimeline positions={ positions } />
      </Container>
    )
  }
}
