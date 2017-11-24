declare module 'bitfinex-api-node' {
  export class BFX {
    public ws: {
      close(): void
    }
    constructor(key: string, secret: string, options?: { version?: number }): BFX
    on(event: string, cb: function): any
    auth(): void
    send(res: any): void
  }
}
