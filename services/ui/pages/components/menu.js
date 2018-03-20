import React, { Component } from 'react'
import Link from 'next/link'
import glamorous from 'glamorous'

export default class extends Component {
  render() {
    const Menu = glamorous.div({
      gridArea: 'sidebar',
      background: '#37474f',
      display: 'flex',
      flexFlow: 'column wrap',
      alignItems: 'center'
    })

    const MenuItem = glamorous.div({
      color: '#ff7043',
      fontSize: '5rem',
      textAlign: 'center',
      display: 'block',
      textDecoration: 'none',
      lineHeight: '2.5rem',
      '> small': {
        fontSize: '.7rem',
        display: 'block',
        opacity: 0
      },
      ':hover': {
        color: '#ffa726',
      },
      ':hover > small': {
        opacity: 1
      }
    })

    return (
      <Menu>
        <Link href='/dashboard'><MenuItem>★<small>Dashboard</small></MenuItem></Link>
        <Link href='/timeline'><MenuItem>⚎<small>Timeline</small></MenuItem></Link>
      </Menu>
    )
  }
}
