import { compose, find, propEq, prop } from 'ramda'

const getBNBAmount = compose(parseFloat, prop('free'), find(propEq('asset', 'BNB')), prop('balances'))

const makeUpdateProps = (account: string) => (amount: number) =>
  ({ id: account, data: { balances: { bnb: { amount, lastCheckTime: Date.now() } } } })

type Requests = {
  accountInfo: (a: null) => Promise<{}>,
  updateAccount: ({ id, data }: { id: string, data: {} }) => Promise<{}>
}

type Main = (account: string, requests: Requests) => () => Promise<any>

const main: Main = (account, { accountInfo, updateAccount }) => () =>
  accountInfo(null).then(compose(updateAccount, makeUpdateProps(account), getBNBAmount))

export default main
