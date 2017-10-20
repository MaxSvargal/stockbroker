const exchanger = (account, pairs) => ({
  name: `exchanger_${account}_${pairs.join(',')}`,
  script: "./src/exchanger/index.ts",
  watch: true,
  env: {
    "DEBUG": "worker",
    "NODE_PATH": "./src",
    "ACCOUNT": account,
    "PAIRS": pairs.join(',')
  }
})

const mcstoch = (account) => (pair, amount) => ({
  name: `mcstoch_${account}_${pair}`,
  script: "./src/mcstoch/index.ts",
  watch: true,
  env: {
    "DEBUG": "worker",
    "NODE_PATH": "./src",
    "ACCOUNT": account,
    "PAIR": pair,
    "AMOUNT": String(amount)
  }
})

const pivot = (account) => (pair, amount) => ({
  name: `pivot_${account}_${pair}`,
  script: "./src/pivot/index.ts",
  watch: true,
  env: {
    "DEBUG": "worker",
    "NODE_PATH": "./src",
    "ACCOUNT": account,
    "PAIR": pair,
    "AMOUNT_MIN": String(amount)
  }
})

module.exports = {
  apps: [
    exchanger('maxsvargal', [ 'BTCUSD' ]),
    exchanger('lesorub', [ 'BTCUSD' ]),

    mcstoch('maxsvargal')('BTCUSD', 0.005),
    mcstoch('lesorub')('BTCUSD', 0.005),

    pivot('maxsvargal')('BTCUSD', 0.005),
    pivot('lesorub')('BTCUSD', 0.005),
  ]
}
