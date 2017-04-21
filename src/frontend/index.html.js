const renderFullPage = (html, preloadedState) => `
  <!doctype html>
  <html>
    <head>
      <title>StockBrockerBot</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, minimal-ui"/>
    </head>
    <body style="margin:0">
      <div id="root">${html}</div>
      <script>
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
      </script>
      ${process.env.NODE_ENV === 'development' ? `
        <script src="/manifest.js"></script>
        <script src="/vendor.js"></script>
        <script src="/main.js"></script>` : `
        <script async src="/bundle.js"></script>`}
    </body>
  </html>
`

export default renderFullPage
