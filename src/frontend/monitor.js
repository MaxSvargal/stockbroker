import { renderToString } from 'react-dom/server'
import { div, a } from 'react-hyperscript-helpers'
import renderFullPage from './index.html'

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
      width: '40vw',
      margin: '.5rem'
    },
    link: pid => ({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      color: '#fff',
      padding: '1rem',
      background: pid > 0 ? '#97c47e' : '#de6a70',
      textDecoration: 'none',
      cursor: pid > 0 ? 'pointer' : 'default'
    }),
    title: {
      fontSize: '1.2rem',
      lineHeight: '1.6rem'
    },
    titleAccount: {
      fontSize: '1em'
    },
    titlePair: {
      fontSize: '1.5em'
    },
    col: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      textAlign: 'right'
    }
  }

  const getUptimeMinutes = uptime =>
    ((new Date().getTime() - uptime) / 1000 / 60).toFixed(0)

  const html = renderToString(
    div({ style: styles.root }, state.map((p, i) =>
      div({ style: styles.item, key: i }, [
        a({
          style: styles.link(p.pid),
          href: `/bot/${p.name.split('_').join('/')}/page/full`
        }, [
          div({ style: styles.title }, [
            div({ style: styles.titleAccount }),
            div({ style: styles.titlePair }, p.name.split('_').join(' '))
          ]),
          p.pid > 0 && div({ style: styles.col }, [
            div({ style: styles.memory }, `${(p.monit.memory / 1000000).toFixed(0)} Mb`),
            div({ style: styles.cpu }, `${p.monit.cpu}%`),
            div({ style: styles.uptime }, `${getUptimeMinutes(p.pm2_env.pm_uptime)} min`)
          ])
        ])
      ])
    )))
  return renderFullPage(html, state)
}

export default handleRender
