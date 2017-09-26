const BFX = require('bitfinex-api-node')

const API_KEY = 'o7yl00PaXcqt6SiNtinCLW2GeEWGMXlaCxAp7sIv6J8'
const API_SECRET = 'SD1xukgXJVFEDAhLr3L0f13J06VRWFHDhtWCubPJHLQ'

export default () => {
  const { ws } = new BFX(API_KEY, API_SECRET, { version: 2 })
  return new Promise((resolve, reject) =>
    ws.on('open', () => {
      ws.on('auth', () => resolve(ws))
      ws.on('error', (err: string) => reject(err))
      ws.auth()
    }))
}
