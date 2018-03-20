import React, { Component } from 'react'
import { Div, Button } from 'glamorous'

export default class extends Component {
  state = { index: 0 }

  onSwitch = () => this.setState({
    index: this.props.children.length > this.state.index + 1 ? this.state.index + 1 : 0
  })

  render() {
    return <Div position='relative' >
      <Button
        onClick={ this.onSwitch }
        position='absolute'
        top='0'
        right='0'
        zIndex='999'
        background='#9575cd'
        color='#fff'>
        Change chart
      </Button>
      <div>{ this.props.children[this.state.index] }</div>
    </Div>
  }
}