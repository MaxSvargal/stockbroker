export const selectCurrencyPair = (state, pair) => state.currencies[pair]
export const selectAsk = state => state.ask
export const selectBid = state => state.bid
export const selectSells = state => state.sell
