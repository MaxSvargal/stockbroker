const HmacSHA512 = require('crypto-js/hmac-sha512')
const nonce = require('nonce')()

const { NODE_ENV, BROWSER } = process.env

if (!BROWSER) {
  /* eslint global-require: 0 */
  global.fetch = require('node-fetch')
}


const keySymbol = Symbol('key')
const secretSymbol = Symbol('secret')
const PRIVATE_API_URL = 'https://poloniex.com/tradingApi'
const DEV_API_URL = 'http://127.0.0.1:8085/tradingApi'

class Poloniex {
  constructor({ key, secret }) {
    this[keySymbol] = key
    this[secretSymbol] = secret
    this.privateRequest = this.privateRequest.bind(this)
  }

  static toParamsString(props) {
    const e = encodeURIComponent
    return Object.keys(props).map(prop => `${e(prop)}=${e(props[prop])}`).join('&')
  }

  getPrivateHeaders(paramsString) {
    const signature = HmacSHA512(paramsString, this[secretSymbol]).toString()
    return {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Key: this[keySymbol],
      Sign: signature
    }
  }

  static request(options) {
    return fetch(options.url, options)
      .then(response => response.json().then(json => ({ json, response })))
      .then(({ json, response }) => {
        if (!response.ok) return { error: json.error || 'Network response was not ok.' }
        return { response: json }
      })
      .catch(error => ({ error }))
  }

  privateRequest(props) {
    const propsWithNonce = Object.assign({}, props, { nonce: nonce(16) })
    const paramsString = Poloniex.toParamsString(propsWithNonce)
    const options = {
      method: 'POST',
      url: NODE_ENV === 'production' ? PRIVATE_API_URL : DEV_API_URL,
      body: paramsString,
      headers: this.getPrivateHeaders(paramsString)
    }
    return Poloniex.request(options)
  }
}

module.exports = Poloniex
