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

const mcvigor = (account) => (pair, amount) => ({
  name: `mcvigor_${account}_${pair}`,
  script: "./src/mcvigor/index.ts",
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

    mcvigor('maxsvargal')('BTCUSD', 0.005),
    mcvigor('lesorub')('BTCUSD', 0.005),
  ]
}
