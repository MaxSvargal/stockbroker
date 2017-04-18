import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter as Router } from 'react-router-dom'
import { h } from 'react-hyperscript-helpers'
import App from '../client/components/App'
import renderFullPage from './index.html'

const handleRender = (store, url) => {
  const context = {}
  const [ , basename, location ] = url.match(/(.+\/page)(\/.+)/)
  const state = store.getState()

  const html = renderToString(
    h(Provider, { store }, [
      h(Router, { context, basename, location }, [
        App()
      ])
    ]))

  return renderFullPage(html, state)
}

export default handleRender
