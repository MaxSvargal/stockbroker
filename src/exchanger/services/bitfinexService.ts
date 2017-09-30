const BFX = require('bitfinex-api-node')
const { ACCOUNT = 'maxsvargal' } = process.env
const accountsKeys = <{ [name: string]: { key: string, secret: string } }>{
  maxsvargal: {
    key: 'o7yl00PaXcqt6SiNtinCLW2GeEWGMXlaCxAp7sIv6J8',
    secret: 'SD1xukgXJVFEDAhLr3L0f13J06VRWFHDhtWCubPJHLQ'
  },
  lesorub: {
    key: 'Y1uTvvDde1Dr4VuThLgTbxCs2yO9cwaC9UDifnFD6cu',
    secret: 'x9Cv1zxRxIgsXD8gp9757dSFRSVQ0PSm0mMHNe0kJlq'
  }
}
const { key, secret } = accountsKeys[ACCOUNT]

export default () => {
  const { ws } = new BFX(key, secret, { version: 2 })
  return new Promise((resolve, reject) =>
    ws.on('open', () => {
      ws.on('auth', () => resolve(ws))
      ws.on('error', (err: string) => reject(err))
      ws.auth()
    }))
}
