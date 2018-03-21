import React, { Component } from 'react'
import Link from 'next/link'
import glamorous, { Button } from 'glamorous'

export default class extends Component {
  onClick (interval) {
    return () => this.props.onSelect(interval)
  }

  render () {
    const Menu = glamorous.div({
      position: 'absolute',
      display: 'flex',
      flexFlow: 'row wrap',
      alignItems: 'center',
      justifyContent: 'center'
    })

    const MenuItem = glamorous.button({
      cursor: 'pointer',
      color: '#fff',
      background: '#ef5350',
      border: 0,
      textAlign: 'center',
      display: 'block',
      textDecoration: 'none',
      marginRight: '.25rem',
      fontSize: '1rem',
      ':hover': {
        color: '#ffebee'
      }
    })

    return (
      <Menu>
        <MenuItem onClick={this.onClick('day')}>day</MenuItem>
        <MenuItem onClick={this.onClick('week')}>week</MenuItem>
        <MenuItem onClick={this.onClick('month')}>month</MenuItem>
        <MenuItem onClick={this.onClick('year')}>year</MenuItem>
      </Menu>
    )
  }
}
