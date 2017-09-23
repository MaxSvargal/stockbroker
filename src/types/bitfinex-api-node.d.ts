declare module 'bitfinex-api-node' {
  export interface WS {
    on(event: string, cb: function): void,
    close(): void,
    auth(): void,
  }

  export default class BFX {
    public ws: WS
    constructor(key: string, secret: string, options?: { version?: number })
  }
}
