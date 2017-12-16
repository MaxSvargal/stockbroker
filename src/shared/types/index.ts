export interface Action {
  type: string
  payload: any
  error?: boolean
}

export type AMOUNT = number
export type AMOUNT_ORIG = number
export type ASK = number
export type ASK_SIZE = number
export type BALANCE = number
export type BALANCE_AVAILABLE = number | null
export type BID = number
export type BID_SIZE = number
export type CID = number
export type CLOSE = number
export type COUNT = number
export type CURRENCY = string
export type DAILY_CHANGE = number
export type DAILY_CHANGE_PERC = number
export type EXEC_AMOUNT = number
export type EXEC_PRICE = number
export type FEE = number
export type FEE_CURRENCY = string
export type FLAGS = number
export type GID = number
export type HIDDEN = number
export type HIGH = number
export type HIGHT = number
export type ID = number
export type KEY = string
export type LAST_PRICE = number
export type LOW = number
export type MAKER = 0 | 1 | -1
export type MTS = number
export type MTS_CREATE = number
export type MTS_UPDATE = number
export type NOTIFY = number
export type OPEN = number
export type ORDER_ID = number
export type ORDER_PRICE = number
export type ORDER_STATUS = 'ACTIVE' | 'EXECUTED' | 'PARTIALLY FILLED' | 'CANCELED'
export type ORDER_TYPE = 'EXCHANGE LIMIT'
export type PAIR = string
export type PLACED_ID = number
export type PRICE = number
export type PRICE_AUX_LIMIT = number
export type PRICE_AVG = number
export type PRICE_TRAILING = number
export type SYMBOL = string
export type TYPE = 'EXCHANGE LIMIT'
export type TYPE_PREV = 'EXCHANGE LIMIT'
export type UNSETTLED_INTEREST = number
export type VOLUME = number
export type WALLET_TYPE = string
export type SIGNAL_VALUE = number

export type CandleData = [ MTS, OPEN, CLOSE, HIGHT, LOW, VOLUME ]
export type MyTradeData = [ KEY, ID, PAIR, MTS_CREATE, ORDER_ID, EXEC_AMOUNT, EXEC_PRICE, ORDER_TYPE, ORDER_PRICE, MAKER, FEE, FEE_CURRENCY ]
export type OrderBookData = [ PRICE, COUNT, AMOUNT ]
export type OrderData = [ ID, GID, CID, SYMBOL, MTS_CREATE, MTS_UPDATE, AMOUNT, AMOUNT_ORIG, TYPE, TYPE_PREV, FLAGS, ORDER_STATUS, PRICE, PRICE_AVG, PRICE_TRAILING, PRICE_AUX_LIMIT, NOTIFY, HIDDEN, PLACED_ID ]
export type TickerData = [ BID, BID_SIZE, ASK, ASK_SIZE, DAILY_CHANGE, DAILY_CHANGE_PERC, LAST_PRICE, VOLUME, HIGH, LOW ]
export type TradeData = [ ID, MTS, AMOUNT, PRICE ]
export type WalletData = [ WALLET_TYPE, CURRENCY, BALANCE, UNSETTLED_INTEREST, BALANCE_AVAILABLE ]

export type AddMACDResultPayload = { pair: string, interval: string, time: number, value: number }
export type AddRVIResultPayload = { symbol: string, time: number, average: number, signal: number }
export type AddStochResultPayload = { symbol: string, time: number, value: number }
export type CancelOrderPayload = { id: ID }
export type CandlePayload = any// [ KEY, CandleData ]
export type CandlesPayload = [ KEY, CandleData[] ]
export type SetOrderBookPayload = [ KEY, CandleData[] ]
export type UpdateOrderBookPayload = [ KEY, CandleData[] ]
export type ClearSignalResultsPayload = { symbol: string }
export type NewOrderPayload = { symbol: string, amount: AMOUNT, price: PRICE }
export type PassiveTradingPayload = { symbol: string, enable: boolean, position: 'SELL' | 'BUY' }
export type PositionPayload = { symbol: SYMBOL, id: ID, mts: MTS, price: PRICE, amount: AMOUNT, covered?: number[], profit?: number, fee?: number, feeCurrency?: string, maker?: MAKER }
export type RequestNewPassiveOrderPayload = {}
export type RequestOrderSequencePayload = { symbol: string, amount: AMOUNT, chunks: number }
export type SetTradeSignalPayload = { symbol: string, name: 'macd' | 'rvi' }
export type TickerPayload = { pair: PAIR, data: TickerData }
export type TradePayload = { pair: PAIR, data: TradeData }
export type TradesPayload = { pair: PAIR, data: TradeData[] }
export type RequestExecPositionPayload = { pair: PAIR, exec: boolean }
export type AddRSIPayload = { pair: PAIR, mts: MTS, value: SIGNAL_VALUE }
export type RSIData = [ MTS, SIGNAL_VALUE ]
