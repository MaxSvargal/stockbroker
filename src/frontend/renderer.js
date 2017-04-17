import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter as Router } from 'react-router-dom'
import { h } from 'react-hyperscript-helpers'
import App from '../client/components/App'
import renderFullPage from './index.html'

const handleRender = store => (req, res) => {
  const preloadedState = store.getState()
  const context = {}

  const html = renderToString(
    h(Provider, { store }, [
      h(Router, { context, location: req.url }, [
        App()
      ])
    ]))

  res.send(renderFullPage(html, preloadedState))
}

export default handleRender
