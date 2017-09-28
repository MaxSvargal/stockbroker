export type AMOUNT = number
export type ASK = number
export type ASK_SIZE = number
export type BALANCE = number
export type BALANCE_AVAILABLE = number | null
export type BID = number
export type BID_SIZE = number
export type CLOSE = number
export type COUNT = number
export type CURRENCY = string
export type DAILY_CHANGE = number
export type DAILY_CHANGE_PERC = number
export type HIGH = number
export type HIGHT = number
export type ID = number
export type KEY = string
export type LAST_PRICE = number
export type LOW = number
export type MTS = number
export type OPEN = number
export type PAIR = string
export type PRICE = number
export type SYMBOL = string
export type UNSETTLED_INTEREST = number
export type VOLUME = number
export type WALLET_TYPE = string

export type CandleData = [ MTS, OPEN, CLOSE, HIGHT, LOW, VOLUME ]
export type CandlePayload = { key: KEY, data: CandleData }
export type CandlesPayload = { key: KEY, data: CandleData[] }
export type OrderBookPayload = [ PRICE, COUNT, AMOUNT ]
export type requestOrderPayload = { symbol: SYMBOL, amount: AMOUNT, price: PRICE }
export type TickerData = [ BID, BID_SIZE, ASK, ASK_SIZE, DAILY_CHANGE, DAILY_CHANGE_PERC, LAST_PRICE, VOLUME, HIGH, LOW ]
export type TickerPayload = { pair: PAIR, data: TickerData }
export type TradeData = [ ID, MTS, AMOUNT, PRICE ]
export type TradePayload = { pair: PAIR, data: TradeData }
export type TradesPayload = { pair: PAIR, data: TradeData[] }
export type WalletData = [ WALLET_TYPE, CURRENCY, BALANCE, UNSETTLED_INTEREST, BALANCE_AVAILABLE ]