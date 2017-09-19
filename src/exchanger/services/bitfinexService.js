import BFX from 'bitfinex-api-node'

const API_KEY = 'o7yl00PaXcqt6SiNtinCLW2GeEWGMXlaCxAp7sIv6J8'
const API_SECRET = 'SD1xukgXJVFEDAhLr3L0f13J06VRWFHDhtWCubPJHLQ'

export default () => {
  const bws = new BFX(API_KEY, API_SECRET, { version: 2 }).ws
  return new Promise((resolve, reject) => bws.on('open', () => {
    bws.on('auth', () => resolve(bws))
    bws.on('error', err => reject(err))
    bws.auth()
  }))
}
