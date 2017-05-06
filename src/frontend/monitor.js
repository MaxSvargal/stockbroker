import { renderToString } from 'react-dom/server'
import { div, a } from 'react-hyperscript-helpers'
import renderFullPage from './index.html'

const assign = (source, ...props) => Object.assign({}, source, ...props)

const handleRender = (state) => {
  const styles = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw'
    },
    item: {
      width: '50vw',
      margin: '.5rem'
    },
    itemBox: pid => ({
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      color: '#fff',
      padding: '0.5rem 1rem',
      background: pid > 0 ? '#97c47e' : '#de6a70',
      cursor: pid > 0 ? 'pointer' : 'default'
    }),
    titleLink: {
      color: '#fff',
      textDecoration: 'none',
      fontSize: '1.6rem',
      lineHeight: '1.6rem'
    },
    col: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      textAlign: 'right'
    },
    btn: {
      border: '1px solid #fff',
      padding: '0.25rem 0.5rem',
      margin: '0.2rem',
      fontSize: '1.1rem',
      textAlign: 'center',
      color: '#fff',
      textDecoration: 'none'
    }
  }

  const getUptimeMinutes = uptime =>
    ((new Date().getTime() - uptime) / 1000 / 60).toFixed(0)

  const html = renderToString(
    div({ style: styles.root }, state.map((p, i) =>
      div({ style: styles.item, key: i }, [
        div({ style: styles.itemBox(p.pid) }, [
          a({ style: styles.titleLink, href: `/bot/${p.name.split('_').join('/')}/page/full` }, [
            div({ style: styles.titlePair }, p.name.split('_').join(' '))
          ]),
          p.pid > 0 && div({ style: styles.col }, [
            div({ style: styles.memory }, `${(p.monit.memory / 1000000).toFixed(0)} Mb`),
            div({ style: styles.cpu }, `${p.monit.cpu}%`),
            div({ style: styles.uptime }, `${getUptimeMinutes(p.pm2_env.pm_uptime)} min`)
          ]),
          div({ style: styles.col }, [
            p.pid === 0 && a({ style: styles.btn, href: `/start/${p.name}` }, '► start'),
            p.pid > 0 && a({ style: styles.btn, href: `/stop/${p.name}` }, '◼ stop'),
            p.pid > 0 && a({ style: styles.btn, href: `/restart/${p.name}` }, '⟲ restart')
          ])
        ])
      ])
    )))
  return renderFullPage(html, state)
}

export default handleRender
