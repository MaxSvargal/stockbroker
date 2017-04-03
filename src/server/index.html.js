const renderFullPage = (html, preloadedState) => `
  <!doctype html>
  <html>
    <head>
      <title>Redux Universal Example</title>
    </head>
    <body style="margin:0">
      <div id="root">${html}</div>
      <script>
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
      </script>
      <script src="/bundle.js"></script>
    </body>
  </html>
`

export default renderFullPage
