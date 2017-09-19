src
  # exchanger
  ## Connect to exchange and crossbar, subscribe to channels and store raw data
    - actions ## for storing
    - stores ## multiple stores for many pairs
    - reducers ## store only raw data
    - services ## connectors to bitfinex and crossbar

  # trader
  ## Trade logic and algorithms for one pair
    - actions ## for trading and analysis
    - store ## get one store used by exchanger
    - reducers ## store algorytm's data
    - services ## connector to crossbar

  # shared
  ## Some shared modules
