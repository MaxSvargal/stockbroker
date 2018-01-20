const binance = require('binance-api-node')

declare module 'binance-api-node' {
  interface Binance {
    constructor(apiKey: ?string, apiSecret: ?string): Binance
    accountInfo(): { balances: { asset: string, free: string, locked: string }[] }
    candles(a: string): Promise<any[]>
    accountInfo(): Promise<{ balances: { asset: string, free: string, locked: string }[] }>
    orderTest({}: { symbol: string, side: 'BUY' | 'SELL', quantity: number, type: 'LIMIT' | 'MARKET' }): Promise<{ orderId: number, status: 'NEW' }>
    myTrades({}: { symbol: string, limit: number }): Promise<{}[]>
  }
  export = <Binance>binance
}
