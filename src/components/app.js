import { Component } from 'react'
import { h, hh, div, span } from 'react-hyperscript-helpers'
import { NavLink, Route, Switch } from 'react-router-dom'

import SimpleMode from 'components/SimpleMode'
import FullMode from 'components/FullMode'
import Actions from 'components/Actions'
import MyOrders from 'components/MyOrders'

class App extends Component {
  render() {
    const styles = this.getStyles()

    return div({ style: styles.root }, [
      div({ style: styles.linksBox }, [
        h(NavLink, { to: '/', style: styles.link, exact: true, activeStyle: styles.activeLink }, [ span('Минимум') ]),
        h(NavLink, { to: '/full', style: styles.link, activeStyle: styles.activeLink }, [ span('Отслеживание') ]),
        h(NavLink, { to: '/orders', style: styles.link, activeStyle: styles.activeLink }, [ span('Транзакции') ]),
        h(NavLink, { to: '/actions', style: styles.link, activeStyle: styles.activeLink }, [ span('Действия') ])
      ]),
      h(Switch, [
        h(Route, { exact: true, path: '/', component: SimpleMode }),
        h(Route, { path: '/full', component: FullMode }),
        h(Route, { path: '/orders', component: MyOrders }),
        h(Route, { path: '/actions', component: Actions })
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
        borderBottom: '1px solid #0e0f10'
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
