const bfx = require('bitfinex-api-node')

declare module 'bitfinex-api-node' {
  export class BFX {
    ws: {
      close(): void
      on(event: string, cb: Function): any
      auth(): void
      send(res: any): void
      subscribeOrderBook(symbol: string) : void
      subscribeCandles(symbol: string, frame: string) : void
    }
    constructor(key: string, secret: string, options?: { version?: number }): BFX
  }
  export = bfx
}
