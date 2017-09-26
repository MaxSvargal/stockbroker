import { createReducer } from 'redux-act'
import { setWallet, updateWallet } from 'exchanger/actions'

type WalletState = {
  [walletType: string]: {
    [currency: string]: {
      balance: number
      unsettledInterest: number
      balanceAvaliable: number | null
    }
  }
}

const walletReducer = createReducer<WalletState>({}, {})

walletReducer.on(setWallet, (state, payload) =>
  payload.reduce((prev, [ walletType, currency, balance, unsettledInterest, balanceAvaliable ]) =>
    ({ ...prev, [walletType]: { ...prev[walletType], [currency]: { balance, unsettledInterest, balanceAvaliable } } }), <WalletState>{} ))

walletReducer.on(updateWallet, (state, [ walletType, currency, balance, unsettledInterest, balanceAvaliable ]) =>
  ({ ...state, [walletType]: { ...state[walletType], [currency]: { balance, unsettledInterest, balanceAvaliable } } }))

export default walletReducer
