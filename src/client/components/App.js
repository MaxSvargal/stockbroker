import { Component } from 'react'
import { h, hh, div, span, style } from 'react-hyperscript-helpers'
import { NavLink, Route, Switch } from 'react-router-dom'

import SimpleMode from './SimpleMode'
import FullMode from './FullMode'
import Preferences from './Preferences'
import Transactions from './Transactions'

class App extends Component {
  render() {
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      style(`@fontface {
        font-family: "Courier_New";
        src: url("Courier_New.woff") format("woff"), url("Courier_New.ttf") format("truetype");
      }`),
      div({ style: styles.linksBox }, [
        h(NavLink, { to: '/', style: styles.link, exact: true, activeStyle: styles.activeLink }, [ span('Минимум') ]),
        h(NavLink, { to: '/full', style: styles.link, activeStyle: styles.activeLink }, [ span('Отслеживание') ]),
        h(NavLink, { to: '/transactions', style: styles.link, activeStyle: styles.activeLink }, [ span('Транзакции') ]),
        h(NavLink, { to: '/preferences', style: styles.link, activeStyle: styles.activeLink }, [ span('Настройки') ])
      ]),
      h(Switch, [
        h(Route, { exact: true, path: '/', component: SimpleMode }),
        h(Route, { path: '/full', component: FullMode }),
        h(Route, { path: '/transactions', component: Transactions }),
        h(Route, { path: '/preferences', component: Preferences })
      ])
    ])
  }

  getStyles() {
    return {
      root: {
        background: '#282c34',
        color: '#fff',
        fontFamily: '"Courier New", monospace',
        fontSize: '16px',
        minHeight: '100vh',
        WebkitFontSmoothing: 'antialiased'
      },
      linksBox: {
        display: 'flex',
        justifyContent: 'center',
        background: '#303030',
        borderBottom: '1px solid #0e0f10',
        position: 'relative',
        height: '2.5rem',
        zIndex: 3
      },
      link: {
        display: 'inline-block',
        padding: '0.5rem 1rem',
        fontSize: '1.4rem',
        color: '#aaaaaa',
        textDecoration: 'none',
        fontWeight: 'bold'
      },
      activeLink: {
        color: '#fc983e'
      }
    }
  }
}

export default hh(App)
