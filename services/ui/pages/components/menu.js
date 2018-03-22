import React, { Component } from 'react'
import Link from 'next/link'
import glamorous from 'glamorous'
import Icon from 'react-icons-kit'
import { ic_history as history } from 'react-icons-kit/md/ic_history'
import { ic_notifications as notify } from 'react-icons-kit/md/ic_notifications'
import { ic_timeline as timeline } from 'react-icons-kit/md/ic_timeline'
import { ic_settings as settings } from 'react-icons-kit/md/ic_settings'

export default class extends Component {
  render() {
    const Menu = glamorous.div({
      gridArea: 'sidebar',
      background: '#37474f',
      display: 'flex',
      flexFlow: 'column wrap',
      alignItems: 'center',
      padding: '1rem 0'
    })

    const MenuItem = glamorous.div({
      cursor: 'pointer',
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
        color: '#ffa726'
      },
      ':hover > small': {
        opacity: 1
      }
    })

    return (
      <Menu>
        <Link href='/dashboard'><MenuItem><Icon icon={notify} size={32} /><small>Dashboard</small></MenuItem></Link>
        <Link href='/closed'><MenuItem><Icon icon={history} size={32} /><small>History</small></MenuItem></Link>
        <Link href='/timeline'><MenuItem><Icon icon={timeline} size={32} /><small>Timeline</small></MenuItem></Link>
        <Link href='/settings'><MenuItem><Icon icon={settings} size={32} /><small>Settings</small></MenuItem></Link>
      </Menu>
    )
  }
}
