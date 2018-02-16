import React, { Component } from 'react'
import { Main } from 'glamorous'

export default class extends Component {
  render() {
    const { data } = this.props
    return (
      <Main background='red' >
        <div>{ data.side }</div>
        <div>{ data.symbol }</div>
        <div>{ data.price }</div>
      </Main>
    )
  }
}
