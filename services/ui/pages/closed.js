import React, { Component } from 'react'
import Link from 'next/link'
import { rehydrate, css } from 'glamor'
import glamorous from 'glamorous'
import fetch from 'isomorphic-fetch'

import PositionsClosedList from './components/positionsClosedList'
import Menu from './components/menu'

export default class extends Component {

  static async getInitialProps ({ query: { positions } }) {
    if (positions) return { positions }

    const res = await fetch(`${location.origin}/api/positions`)
    const json = await res.json()
    return { positions: json }
  }

  render () {
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

    return (
      <Container>
        <Menu />
        <PositionsClosedList positions={ positions } />
      </Container>
    )
  }
}
