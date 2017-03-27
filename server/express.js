const express = require('express')
const http = require('http')
const path = require('path')
const WebSocket = require('ws')
const r = require('rethinkdb')

r.connect({ host: 'localhost', port: 28015 }, (connErr, conn) => {
  if (connErr) throw connErr
  r.db('test').tableCreate('tv_shows').run(conn, (tableErr, tableRes) => {
    if (tableErr) throw tableErr
    console.log(tableRes)
    r.table('tv_shows').insert({ name: 'Star Trek TNG' }).run(conn, (insertErr, insertRes) => {
      if (insertErr) throw insertErr
      console.log(insertRes)
    })
  })
})

const app = express()

app.use('/', express.static(path.join(__dirname, '../dist')))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on('connection', ws => {
  ws.on('message', message =>
    console.log('received: %s', message))
  ws.send('something')
})

server.listen(3000, () => console.log('Listening on %d', server.address().port))
