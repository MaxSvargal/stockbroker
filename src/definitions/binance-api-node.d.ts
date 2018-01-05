const binance = require('binance-api-node')

declare module 'binance-api-node' {
  export class Binance {
    constructor(apiKey: ?string, apiSecret: ?string): Binance
  }
  export = binance
}
