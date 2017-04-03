require("source-map-support").install();
(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/Users/maxsvargal/Documents/projects/poloniex";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 53);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react-hyperscript-helpers");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_act__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_act___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux_act__);


const addBuyChunks = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('ADD_BUY_CHUNKS')
/* harmony export (immutable) */ __webpack_exports__["i"] = addBuyChunks;

const addChunkedCurrency = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('ADD_CHUNKED_CURRENCY')
/* harmony export (immutable) */ __webpack_exports__["g"] = addChunkedCurrency;

const addEstimateRatio = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('ADD_ESTIMATE_RATIO')
/* harmony export (immutable) */ __webpack_exports__["t"] = addEstimateRatio;

const addSellChunks = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('ADD_SELL_CHUNKS')
/* harmony export (immutable) */ __webpack_exports__["f"] = addSellChunks;

const addStats = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('ADD_STATS')
/* harmony export (immutable) */ __webpack_exports__["s"] = addStats;

const botMessage = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('BOT_MESSAGE')
/* harmony export (immutable) */ __webpack_exports__["h"] = botMessage;

const buyFailure = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('BUY_FAILURE')
/* harmony export (immutable) */ __webpack_exports__["l"] = buyFailure;

const buySuccess = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('BUY_SUCCESS')
/* harmony export (immutable) */ __webpack_exports__["k"] = buySuccess;

const convertCurrencyToChunks = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('CONVERT_CURRENCY_TO_CHUNKS')
/* unused harmony export convertCurrencyToChunks */

const doBuy = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('DO_BUY')
/* harmony export (immutable) */ __webpack_exports__["j"] = doBuy;

const doSell = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('DO_SELL')
/* harmony export (immutable) */ __webpack_exports__["m"] = doSell;

const getCurrentPair = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('GET_CURRENT_PAIR')
/* unused harmony export getCurrentPair */

const newTrade = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('NEW_TRADE')
/* harmony export (immutable) */ __webpack_exports__["x"] = newTrade;

const orderBookModify = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('ORDER_BOOK_MODIFY')
/* harmony export (immutable) */ __webpack_exports__["w"] = orderBookModify;

const orderBookRemove = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('ORDER_BOOK_REMOVE')
/* harmony export (immutable) */ __webpack_exports__["v"] = orderBookRemove;

const removeOpenBuys = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('REMOVE_OPEN_BUYS')
/* harmony export (immutable) */ __webpack_exports__["d"] = removeOpenBuys;

const removeOpenSells = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('REMOVE_OPEN_SELLS')
/* harmony export (immutable) */ __webpack_exports__["e"] = removeOpenSells;

const sellFailure = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('SELL_FAILURE')
/* harmony export (immutable) */ __webpack_exports__["o"] = sellFailure;

const sellSuccess = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('SELL_SUCCESS')
/* harmony export (immutable) */ __webpack_exports__["n"] = sellSuccess;

const sendBuys = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('SEND_BUYS')
/* harmony export (immutable) */ __webpack_exports__["c"] = sendBuys;

const sendSells = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('SEND_SELLS')
/* harmony export (immutable) */ __webpack_exports__["b"] = sendSells;

const setCurrency = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('SET_CURRENCY')
/* harmony export (immutable) */ __webpack_exports__["q"] = setCurrency;

const setCurrencyPair = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('SET_CURRENCY_PAIR')
/* harmony export (immutable) */ __webpack_exports__["y"] = setCurrencyPair;

const setCurrentFinalResult = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('SET_CURRENT_FINAL_RESULT')
/* harmony export (immutable) */ __webpack_exports__["u"] = setCurrentFinalResult;

const setFreeCurrencies = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('SET_FREE_CURRENCIES')
/* harmony export (immutable) */ __webpack_exports__["r"] = setFreeCurrencies;

const setThreshold = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('SET_THRESHOLD')
/* harmony export (immutable) */ __webpack_exports__["a"] = setThreshold;

const setTrends = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('SET_TRENDS')
/* unused harmony export setTrends */

const updateWallet = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createAction"])('UPDATE_WALLET')
/* harmony export (immutable) */ __webpack_exports__["p"] = updateWallet;



/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const { ACCOUNT: { pair } } = __webpack_require__.i({"NODE_ENV":"production","BROWSER":false,"ACCOUNT":{"pair":"BTC_ETH","key":"I94AGT6H-HEUAIL5B-G34YF99I-IYR0777F","secret":"758c86f9c922e164f573801663f641acb625e4118f646f0b5612da38cd18a171716d580af12104c3719b935b2cf1510f6df3359e28f403e9bf32e2cbe2faa97f"}})

const USDT_ETH = 'USDT_ETH'
/* unused harmony export USDT_ETH */

const USDT_BTC = 'USDT_BTC'
/* unused harmony export USDT_BTC */

const BTC_ETH = 'BTC_ETH'
/* unused harmony export BTC_ETH */

const CURRENT_PAIR = pair
/* harmony export (immutable) */ __webpack_exports__["a"] = CURRENT_PAIR;

const FIVE_MINUTES = 1000 * 60 * 5
/* unused harmony export FIVE_MINUTES */

const TEN_MINUTES = 1000 * 60 * 10
/* harmony export (immutable) */ __webpack_exports__["b"] = TEN_MINUTES;

const TWENTY_MINUTES = 1000 * 60 * 20
/* unused harmony export TWENTY_MINUTES */



/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("redux-saga/effects");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("redux-act");

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_const__ = __webpack_require__(4);


const selectAsk = state => state.ask
/* unused harmony export selectAsk */

const selectBid = state => state.bid
/* unused harmony export selectBid */

const selectConclusions = state => state.conclusions
/* unused harmony export selectConclusions */

const selectCurrencyPair = state => state.currencies[__WEBPACK_IMPORTED_MODULE_0_const__["a" /* CURRENT_PAIR */]]
/* harmony export (immutable) */ __webpack_exports__["b"] = selectCurrencyPair;

const selectCurrentPair = state => state.currentPair.split('_')
/* harmony export (immutable) */ __webpack_exports__["a"] = selectCurrentPair;

const selectSells = state => state.sell
/* unused harmony export selectSells */

const selectTotals = state => state.totals
/* unused harmony export selectTotals */

const selectWallet = state => state.wallet
/* harmony export (immutable) */ __webpack_exports__["c"] = selectWallet;

const selectThreshold = state => state.threshold
/* harmony export (immutable) */ __webpack_exports__["i"] = selectThreshold;

const selectChunkedCurrency = state => state.chunkedCurrency
/* unused harmony export selectChunkedCurrency */


const selectSellsLastTime = (state, time) => {
  const currTime = new Date().getTime()
  return state.sell.filter(i => i[0] > currTime - time)
}
/* harmony export (immutable) */ __webpack_exports__["g"] = selectSellsLastTime;


const selectBuysLastTime = (state, time) => {
  const currTime = new Date().getTime()
  return state.buy.filter(i => i[0] > currTime - time)
}
/* harmony export (immutable) */ __webpack_exports__["f"] = selectBuysLastTime;


const selectUncoveredSells = state =>
  state.mySells.filter(v => v[4] === 0)
/* harmony export (immutable) */ __webpack_exports__["d"] = selectUncoveredSells;


const selectUncoveredBuys = state =>
  state.myBuys.filter(v => v[4] === 0)
/* harmony export (immutable) */ __webpack_exports__["e"] = selectUncoveredBuys;


const selectLastTenStats = state =>
  state.stats.slice(state.stats.length - 11, state.stats.length - 1)
/* harmony export (immutable) */ __webpack_exports__["h"] = selectLastTenStats;


const selectEstimateRatios = state =>
  state.statsEstimate.slice(state.statsEstimate.length - 11, state.statsEstimate.length - 1)
/* harmony export (immutable) */ __webpack_exports__["j"] = selectEstimateRatios;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* eslint import/prefer-default-export: 0 */

const cropNumber = num => Number((num).toFixed(8))
/* harmony export (immutable) */ __webpack_exports__["a"] = cropNumber;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const time = val => val ? new Date(val).getTime() : new Date().getTime()
/* harmony export (immutable) */ __webpack_exports__["a"] = time;


const removeIndex = (arr, index) => index === -1 ? arr :
  [ ...arr.slice(0, index), ...arr.slice(index + 1) ]
/* harmony export (immutable) */ __webpack_exports__["d"] = removeIndex;


const mergeOnAmount = (state, rate, amount) =>
  amount ?
    [ ...state, [ time(), rate, amount ] ] :
    [ ...state.slice(0, -1), [ time(), rate, state[state.length - 1][1] ] ]
/* harmony export (immutable) */ __webpack_exports__["c"] = mergeOnAmount;


const getOnlyLast = (arr, minutes) => {
  const currTime = time()
  return arr.reduce((prev, curr) =>
    currTime - curr[0] < minutes ? [ ...prev, curr ] : prev, [])
}
/* harmony export (immutable) */ __webpack_exports__["b"] = getOnlyLast;



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_client_utils__ = __webpack_require__(30);





const checkStringContain = (input, arr) =>
  arr.reduce((prev, curr) => (prev === true || input.search(curr) !== -1), false)

class BotLog extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  render() {
    const { data } = this.props
    const styles = this.getStyles()

    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: styles.root }, data.map((item, index) =>
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: styles.item(index, item[1]) }, `${__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_client_utils__["a" /* formatDate */])(item[0])} ${item[1]}`)))
  }

  getStyles() {
    return {
      root: {
        fontSize: '1.1rem',
        lineHeight: '1.4rem',
        // minWidth: '45vw',
        // maxWidth: '55vw',
        // height: '43.5vh',
        // overflow: 'scroll'
      },
      item: (index, str) => ({
        padding: '.25rem 0',
        borderBottom: '1px solid #3b4048',
        background: index % 2 ? 'transparent' : '#343940',
        fontWeight: checkStringContain(str, [ 'Куплено', 'Продано', 'Ошибка' ]) ? 'bold' : 'normal',
        color: (str.search('Куплено') !== -1 && '#f8fcf5') ||
          (str.search('Продано') !== -1 && '#fcf7f5') ||
          (str.search('Ошибка') !== -1 && '#ef3435') ||
          '#fff'
      })
    }
  }
}

const mapStateToProps = ({ botMessages }) =>
  ({ data: botMessages.slice().reverse().slice(0, 200) })

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["hh"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps)(BotLog));


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_saga_effects___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_server_utils__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_shared_actions__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__selectors__ = __webpack_require__(7);
/* harmony export (immutable) */ __webpack_exports__["a"] = TradeSaga;
/* harmony export (immutable) */ __webpack_exports__["c"] = buySaga;
/* harmony export (immutable) */ __webpack_exports__["b"] = sellSaga;





/* eslint require-yield: 0 */
function* TradeSaga() {
  false
}

function* buySaga(rate, hold) {
  // брать самый объёмный чанк
  const searchMinimalSellIndex = (arr, byRate) => {
    const lessThenBuy = arr.map(v => v[1]).reduce((prev, curr) =>
      (curr > byRate + hold ? [ ...prev, curr ] : prev), [])
    const minRate = Math.min(...lessThenBuy)
    const valIndex = arr.findIndex(v => v[1] === minRate)
    const valVolume = arr[valIndex] && arr[valIndex][2]
    return [ valIndex, minRate, valVolume ]
  }

  const sells = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_3__selectors__["d" /* selectUncoveredSells */])
  const [ coverIndex, coverRate, coverValue ] = searchMinimalSellIndex(sells, rate)

  if (coverIndex !== -1) {
    const fee = coverValue * 0.25
    const profit = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_server_utils__["a" /* cropNumber */])((coverRate - rate) * (coverValue - fee))

    yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_shared_actions__["j" /* doBuy */])([ rate, coverValue, coverIndex ]))

    const { success, failure } = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["race"])({
      success: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["take"])(__WEBPACK_IMPORTED_MODULE_2_shared_actions__["k" /* buySuccess */]),
      failure: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["take"])(__WEBPACK_IMPORTED_MODULE_2_shared_actions__["l" /* buyFailure */])
    })

    if (success) yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_shared_actions__["h" /* botMessage */])(`Куплено за ${rate}, покрыто ${coverRate}, объём ${coverValue}, прибыль ${profit}`))
    else if (failure) yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_shared_actions__["h" /* botMessage */])(`Покупка не удалась. Ошибка: ${failure.payload[2]}`))
  } else {
    yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_shared_actions__["h" /* botMessage */])(`Покупка за ${rate} не покрывает ни одной предыдущей продажи`))
  }
}

function* sellSaga(rate, hold) {
  const searchMinimalBuyIndex = (arr, byRate) => {
    const moreThenSell = arr.map(v => v[1]).reduce((prev, curr) =>
      (curr < byRate - hold ? [ ...prev, curr ] : prev), [])
    const minRate = Math.min(...moreThenSell)
    const valIndex = arr.findIndex(v => v[1] === minRate)
    const valVolume = arr[valIndex] && arr[valIndex][2]
    return [ valIndex, minRate, valVolume ]
  }

  const buys = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_3__selectors__["e" /* selectUncoveredBuys */])
  const [ coverIndex, coverRate, coverValue ] = searchMinimalBuyIndex(buys, rate)

  if (coverIndex !== -1) {
    const fee = coverValue * 0.25
    const profit = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_server_utils__["a" /* cropNumber */])((rate - coverRate) * (coverValue - fee))

    yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_shared_actions__["m" /* doSell */])([ rate, coverValue, coverIndex ]))

    const { success, failure } = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["race"])({
      success: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["take"])(__WEBPACK_IMPORTED_MODULE_2_shared_actions__["n" /* sellSuccess */]),
      failure: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["take"])(__WEBPACK_IMPORTED_MODULE_2_shared_actions__["o" /* sellFailure */])
    })

    if (success) yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_shared_actions__["h" /* botMessage */])(`Продано за ${rate}, покрыто ${coverRate}, объём ${coverValue}, прибыль: ${profit}`))
    else if (failure) yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_shared_actions__["h" /* botMessage */])(`Продажа не удалась. Ошибка: ${failure.payload[2]}`))
  } else {
    yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_shared_actions__["h" /* botMessage */])(`Продажа за ${rate} не покрывает ни одной предыдущей покупки`))
  }
}


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("bignumber.js");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("redux-saga");

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_dom_server__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_dom_server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react_dom_server__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router_dom__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_hyperscript_helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_hyperscript_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_hyperscript_helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_client_components_App__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__index_html__ = __webpack_require__(31);







const handleRender = store => (req, res) => {
  const preloadedState = store.getState()
  const context = {}

  const html = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_react_dom_server__["renderToString"])(
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_react_hyperscript_helpers__["h"])(__WEBPACK_IMPORTED_MODULE_1_react_redux__["Provider"], { store }, [
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_react_hyperscript_helpers__["h"])(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["StaticRouter"], { context }, [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_client_components_App__["a" /* default */])()
      ])
    ]))

  res.send(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__index_html__["a" /* default */])(html, preloadedState))
}

/* harmony default export */ __webpack_exports__["a"] = handleRender;


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_pouchdb__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_pouchdb___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_pouchdb__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_redux_pouchdb__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_redux_pouchdb___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_redux_pouchdb__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_redux_saga__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_redux_saga___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_redux_saga__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_shared_reducers__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_server_sagas__ = __webpack_require__(32);








/* harmony default export */ __webpack_exports__["a"] = scServer => {
  // move it?
  const db = new __WEBPACK_IMPORTED_MODULE_0_pouchdb___default.a('./server/db/stockbroker.alpha', { adapter: 'leveldb' })

  const actionCatchMiddleware = () => next => action => {
    scServer.exchange.publish('update', action)
    next(action)
  }

  const sagaMiddleware = __WEBPACK_IMPORTED_MODULE_3_redux_saga___default()()
  const middlewares = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_redux__["applyMiddleware"])(sagaMiddleware, actionCatchMiddleware)
  const persist = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_redux_pouchdb__["persistentStore"])(db)
  const createStoreWithMiddleware = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_redux__["compose"])(persist, middlewares)(__WEBPACK_IMPORTED_MODULE_1_redux__["createStore"])
  const store = createStoreWithMiddleware(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_redux_pouchdb__["persistentReducer"])(__WEBPACK_IMPORTED_MODULE_4_shared_reducers__["a" /* default */]))

  sagaMiddleware.run(__WEBPACK_IMPORTED_MODULE_5_server_sagas__["a" /* default */])
  return store
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_debounce__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_debounce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_debounce__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_shared_actions__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ChunksAddForm__ = __webpack_require__(21);









class Settings extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props)
    this.refers = {}
    this.state = {
      sellChunkAmount: 0,
      buyChunkAmount: 0,
      flashBg: false,
      showBuyForm: true
    }
    this.sendSells = this.sendSells.bind(this)
    this.sendBuys = this.sendBuys.bind(this)
    this.removeOpenSells = this.removeOpenSells.bind(this)
    this.removeOpenBuys = this.removeOpenBuys.bind(this)
    this.changeThreshold = __WEBPACK_IMPORTED_MODULE_3_debounce___default()(props.setThreshold, 500)
  }

  onThresholdChange(e) {
    this.changeThreshold(Number(e.target.value))
  }

  flashBackground() {
    this.setState({ flashBg: true })
    setTimeout(() => this.setState({ flashBg: false }), 200)
  }

  removeOpenSells() {
    this.props.removeOpenSells()
    this.flashBackground()
  }

  removeOpenBuys() {
    this.props.removeOpenBuys()
    this.flashBackground()
  }

  sendSells(data) {
    this.props.sendSells(data)
    this.flashBackground()
  }

  sendBuys(data) {
    this.props.sendBuys(data)
    this.flashBackground()
  }

  render() {
    const { pairNames, currency /* , freeCurrencies */, threshold, wallet } = this.props
    const isWalletIsset = !!(wallet[pairNames[0]] || wallet[pairNames[1]])
    const isCurrencyIsset = !!(currency && currency.highestBid)
    const styles = this.getStyles()
    console.log({ isWalletIsset, isCurrencyIsset });

    return !(isWalletIsset && isCurrencyIsset) ?
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__["div"])({ style: styles.loading }, 'Получение баланса...') :
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__["div"])({ style: styles.root(this.state.flashBg) }, [
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__["div"])({ style: styles.box }, [

        // div({ style: styles.row }, [
        //   div({ style: styles.col }, [
        //     label({ style: styles.label }, 'Валюта'),
        //     div({ style: styles.info }, pairNames[0]),
        //     div({ style: styles.info }, pairNames[1])
        //   ]),
        //   div({ style: styles.col }, [
        //     label({ style: styles.label }, 'На счету'),
        //     div({ style: styles.info }, wallet[pairNames[0]]),
        //     div({ style: styles.info }, wallet[pairNames[1]])
        //   ]),
        //   div({ style: styles.col }, [
        //     label({ style: styles.label }, 'Доступно'),
        //     div({ style: styles.info }, freeCurrencies[0]),
        //     div({ style: styles.info }, freeCurrencies[1])
        //   ]),
        //   div({ style: styles.col }, [
        //     label({ style: styles.label }, 'В чанках'),
        //     div({ style: styles.info }, cropNumber(wallet[pairNames[0]] - freeCurrencies[0])),
        //     div({ style: styles.info }, cropNumber(wallet[pairNames[1]] - freeCurrencies[1]))
        //   ])
        // ]),

        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__ChunksAddForm__["a" /* default */])({
          pairNames,
          rate: currency && currency.highestBid,
          amount: wallet[pairNames[1]],
          onCreateBuy: this.sendBuys,
          onCreateSell: this.sendSells
        }),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__["div"])({ style: styles.row }, [
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__["div"])({ style: styles.col }, [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__["label"])({ style: styles.label }, 'Порог прибыли'),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__["input"])({
              type: 'number',
              style: styles.input,
              defaultValue: threshold,
              onChange: e => this.onThresholdChange(e)
            })
          ]),
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__["div"])({ style: styles.col }, [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__["button"])({
              style: styles.removeBtn,
              onClick: this.removeOpenSells
            }, 'Удалить открытые продажи')
          ]),
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__["div"])({ style: styles.col }, [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__["button"])({
              style: styles.removeBtn,
              onClick: this.removeOpenBuys
            }, 'Удалить открытые покупки')
          ])
        ])
      ])
    ])
  }

  getStyles() {
    return {
      root: animateState => ({
        width: '100vw',
        height: '94vh',
        background: animateState ? '#30db7d' : '#282c34',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: animateState ? 'background 0.05s' : 'background 1s ease-out'
      }),
      box: {
        maxWidth: '95vw',
        minWidth: '50vw',
        minHeight: '75vh'
      },
      loading: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      label: {
        display: 'block',
        margin: '0.5rem 0'
      },
      input: {
        fontSize: '1.2rem',
        padding: '.25rem .5rem'
      },
      row: {
        display: 'flex',
        justifyContent: 'center'
      },
      col: {
        margin: '.5rem'
      },
      removeBtn: {
        background: '#de6a70',
        color: '#fff',
        border: 0,
        fontSize: '.9rem',
        padding: '.65rem 1rem',
        margin: '2rem .2rem 0 .2rem'
      }
    }
  }
}

Settings.propTypes = {
  threshold: __WEBPACK_IMPORTED_MODULE_0_react__["PropTypes"].number,
  currency: __WEBPACK_IMPORTED_MODULE_0_react__["PropTypes"].object,
  wallet: __WEBPACK_IMPORTED_MODULE_0_react__["PropTypes"].object
}

const mapStateToProps = ({ threshold, currencies, currentPair, freeCurrencies, wallet }) =>
  ({
    pairNames: currentPair.split('_'),
    currency: currencies[currentPair],
    freeCurrencies,
    threshold,
    wallet
  })

const dispatchToProps = {
  setThreshold: __WEBPACK_IMPORTED_MODULE_5_shared_actions__["a" /* setThreshold */], sendSells: __WEBPACK_IMPORTED_MODULE_5_shared_actions__["b" /* sendSells */], sendBuys: __WEBPACK_IMPORTED_MODULE_5_shared_actions__["c" /* sendBuys */], removeOpenBuys: __WEBPACK_IMPORTED_MODULE_5_shared_actions__["d" /* removeOpenBuys */], removeOpenSells: __WEBPACK_IMPORTED_MODULE_5_shared_actions__["e" /* removeOpenSells */]
}

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_react_hyperscript_helpers__["hh"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_router__["withRouter"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps, dispatchToProps)(Settings)));


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router_dom__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__SimpleMode__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__FullMode__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Actions__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__MyOrders__ = __webpack_require__(25);









class App extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  render() {
    const styles = this.getStyles()

    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.root }, [
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.linksBox }, [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["h"])(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["NavLink"], { to: '/', style: styles.link, exact: true, activeStyle: styles.activeLink }, [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["span"])('Минимум') ]),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["h"])(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["NavLink"], { to: '/full', style: styles.link, activeStyle: styles.activeLink }, [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["span"])('Отслеживание') ]),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["h"])(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["NavLink"], { to: '/orders', style: styles.link, activeStyle: styles.activeLink }, [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["span"])('Транзакции') ]),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["h"])(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["NavLink"], { to: '/actions', style: styles.link, activeStyle: styles.activeLink }, [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["span"])('Действия') ])
      ]),
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["h"])(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["Switch"], [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["h"])(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["Route"], { exact: true, path: '/', component: __WEBPACK_IMPORTED_MODULE_3__SimpleMode__["a" /* default */] }),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["h"])(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["Route"], { path: '/full', component: __WEBPACK_IMPORTED_MODULE_4__FullMode__["a" /* default */] }),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["h"])(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["Route"], { path: '/orders', component: __WEBPACK_IMPORTED_MODULE_6__MyOrders__["a" /* default */] }),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["h"])(__WEBPACK_IMPORTED_MODULE_2_react_router_dom__["Route"], { path: '/actions', component: __WEBPACK_IMPORTED_MODULE_5__Actions__["a" /* default */] })
      ])
    ])
  }

  getStyles() {
    return {
      root: {
        background: '#282c34',
        color: '#fff',
        fontFamily: '"Courier New", monospace',
        fontSize: '16px',
        minHeight: '100vh',
        WebkitFontSmoothing: 'antialiased'
      },
      linksBox: {
        display: 'flex',
        justifyContent: 'center',
        background: '#303030',
        borderBottom: '1px solid #0e0f10'
      },
      link: {
        display: 'inline-block',
        padding: '0.5rem 1rem',
        fontSize: '1.4rem',
        color: '#aaaaaa',
        textDecoration: 'none',
        fontWeight: 'bold'
      },
      activeLink: {
        color: '#fc983e'
      }
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["hh"])(App);


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bignumber_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bignumber_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_bignumber_js__);




class ChunksAddForm extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props)
    this.refers = {}
    this.state = {
      chunkAmount: 0,
      currencyChunkAmount: 0,
      currencyTotalAmount: 0
    }
  }

  calculate() {
    const { amount, chunks, rate } = this.refers

    const chunkAmount = new __WEBPACK_IMPORTED_MODULE_2_bignumber_js___default.a(0)
      .plus(amount.value || 0)
      .div(chunks.value || 1)
      .toFixed(8)

    const currencyTotalAmount = new __WEBPACK_IMPORTED_MODULE_2_bignumber_js___default.a(0)
      .plus(rate.value || 1)
      .times(amount.value || 1)
      .times(chunks.value || 1)
      .toFixed(8)

    const currencyChunkAmount = new __WEBPACK_IMPORTED_MODULE_2_bignumber_js___default.a(0)
      .plus(currencyTotalAmount)
      .div(chunks.value || 1)
      .toFixed(8)

    this.setState({ chunkAmount, currencyChunkAmount, currencyTotalAmount })
  }

  onCreateBuy() {
    const { rate, chunks } = this.refers
    this.props.onCreateBuy({
      rate: Number(rate.value),
      amount: Number(this.state.chunkAmount),
      chunksNum: Number(chunks.value)
    })
  }

  onCreateSell() {
    const { rate, chunks } = this.refers
    this.props.onCreateSell({
      rate: Number(rate.value),
      amount: Number(this.state.chunkAmount),
      chunksNum: Number(chunks.value)
    })
  }

  render() {
    const { pairNames, rate, amount } = this.props
    const styles = this.getStyles()

    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.row }, [
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.col }, [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["label"])({ style: styles.label }, `Объём ${pairNames[1]}`),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["input"])({
          type: 'number',
          style: styles.input,
          defaultValue: amount,
          ref: ref => (this.refers.amount = ref),
          onChange: () => this.calculate()
        }),

        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["label"])({ style: styles.label }, `Всего ${pairNames[0]}`),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["span"])({
          type: 'number',
          style: styles.output },
          this.state.currencyTotalAmount)
      ]),
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.col }, [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["label"])({ style: styles.label }, 'Чанков'),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["input"])({
          type: 'number',
          style: styles.input,
          defaultValue: 0,
          ref: ref => (this.refers.chunks = ref),
          onChange: () => this.calculate()
        }),

        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["label"])({ style: styles.label }, `${pairNames[1]} в чанке`),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["span"])({
          type: 'number',
          style: styles.output },
          this.state.chunkAmount)
      ]),
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.col }, [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["label"])({ style: styles.label }, `Цена для чанка ${pairNames[0]}`),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["input"])({
          type: 'number',
          style: styles.input,
          defaultValue: rate,
          ref: ref => (this.refers.rate = ref),
          onChange: () => this.calculate()
        }),

        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["label"])({ style: styles.label }, `${pairNames[0]} в чанке`),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["span"])({
          type: 'number',
          style: styles.output },
          this.state.currencyChunkAmount)
      ]),
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.actionsRow }, [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["button"])({
          style: styles.createBtn,
          onClick: () => this.onCreateBuy() },
          'Создать покупки'),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["button"])({
          style: styles.createBtn,
          onClick: () => this.onCreateSell() },
          'Создать продажи')
      ])
    ])
  }

  getStyles() {
    return {
      label: {
        display: 'block',
        padding: '2rem 0 1rem'
      },
      input: {
        fontSize: '1.2rem',
        padding: '.25rem .5rem'
      },
      row: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: '0 .5rem',
        padding: '0.5rem 0.5rem'
      },
      col: {
        margin: '.5rem'
      },
      output: {
        fontSize: '2rem',
        display: 'inline-block',
        minWidth: '12rem'
      },
      createBtn: {
        background: '#54a9eb',
        color: '#fff',
        border: 0,
        fontSize: '1.2rem',
        padding: '1rem 3rem',
        margin: '4rem 1rem'
      },
      actionsRow: {
        display: 'flex',
        minWidth: '55vw',
        justifyContent: 'space-between'
      }
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["hh"])(ChunksAddForm);


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__FinalCurrentResult__ = __webpack_require__(23);






// const audio = new Audio('Tink.m4a')

class CurrencyStats extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  constructor(props) {
    super(props)
    this.inputRef = null
    this.state = {
      outputValue: '',
      watchValue: ''
    }
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleWatcherKeyPress = this.handleWatcherKeyPress.bind(this)
  }

  handleKeyPress(e) {
    this.setState({
      outputValue: (e.target.value * this.props.data.last).toFixed(8)
    })
  }

  handleWatcherKeyPress(e) {
    this.setState({
      watchValue: e.target.value
    })
  }

  componentWillReceiveProps(nextProps) {
    // const { watchValue } = this.state
    // const watchValueNumber = Number(watchValue)
    // if (nextProps.data.last >= watchValueNumber && watchValueNumber !== 0) {
    //   audio && audio.play()
    // }

    document && (document.title = nextProps.data.last)
    this.inputRef && this.handleKeyPress({ target: { value: this.inputRef.value } })
  }

  render() {
    const { data, currentPair } = this.props
    const { outputValue } = this.state
    const styles = this.getStyles()

    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: styles.root }, [
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__FinalCurrentResult__["a" /* default */])(),
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["h1"])({ style: styles.h1 }, currentPair),
      data ?
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])([
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: styles.watcher }, [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["input"])({
              style: styles.inputWatcher,
              onKeyUp: this.handleWatcherKeyPress,
              ref: (c => (this.watcherRef = c))
            }),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])('- уведомление при курсе')
          ]),
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: styles.course }, [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["input"])({
              style: styles.input,
              onKeyUp: this.handleKeyPress,
              ref: (c => (this.inputRef = c))
            }),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: styles.x }, 'x'),
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: styles.bigger }, data.last),
            outputValue > 0 && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: styles.total }, `= ${outputValue} ${currentPair.split('_')[0]}`)
          ]),
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])([ 'Спрос: ', data.lowestAsk ]),
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])([ 'Предложение: ', data.highestBid ]),
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])([ 'Высшая цена за 24 часа: ', data.hrHigh ]),
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])([ 'Низшая цена за 24 часа: ', data.hrLow ]),
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])([ 'Сдвиг: ', data.percentChange, '%' ]),
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])([ 'Объём: ', data.baseVolume ]),
        ])
      :
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])('Ожидание обновления курса...')
    ])
  }

  getStyles() {
    return {
      root: {
        fontSize: '1.1rem',
        lineHeight: '1.6rem',
        fontWeight: 'bold',
        marginBottom: '2rem'
      },
      h1: {
        fontSize: '3rem',
        margin: '1rem 0 2.5rem 0'
      },
      bigger: {
        fontSize: '3.6rem',
        margin: '2.5rem 0',
        color: '#e352c9'
      },
      course: {
        display: 'flex'
      },
      input: {
        width: '7rem',
        height: '2.8rem',
        marginTop: '1.75rem',
        background: '#144b44',
        color: '#fff',
        border: 0,
        fontWeight: 'bold',
        fontSize: '1.4rem'
      },
      inputWatcher: {
        border: 0,
        width: '7rem',
        marginRight: '.8rem',
        background: '#144b44',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1.2rem'
      },
      watcher: {
        display: 'flex'
      },
      x: {
        display: 'flex',
        width: '2rem',
        height: '3rem',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '1.75rem',
        fontSize: '2rem',
        color: '#24a292'
      },
      total: {
        fontSize: '1.6rem',
        marginTop: '5rem',
        marginLeft: '-16rem',
        color: '#24a292'
      }
    }
  }
}

const mapStateToProps = ({ currencies, currentPair }) =>
  ({ data: currencies[currentPair], currentPair })

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["hh"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps)(CurrencyStats));


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__);




class FinalCurrentResult extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  render() {
    const { finalCurrentResult } = this.props
    const isPositive = finalCurrentResult >= 0
    const chars = [ ...new Array(Math.abs(finalCurrentResult / 2)) ]
    const styles = this.getStyles()

    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: styles.root },
      chars.map((v, i) => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: styles.char(isPositive, i) }, isPositive ? '▲' : '▼')))
  }

  getStyles() {
    return {
      root: {
        position: 'absolute',
        marginLeft: '14rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '0.15rem',
        height: '2rem'
      },
      char: (isPositive, index) => ({
        color: isPositive ? `#72bf${index * 2}d` : `#c349${index * 2}a`,
        fontSize: '1.75rem',
        marginTop: '-1rem',
        alignSelf: 'center'
      })
    }
  }
}

const mapStateToProps = ({ finalCurrentResult }) => ({ finalCurrentResult })
/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["hh"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps)(FinalCurrentResult));


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__BotLog__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__TradeTable__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__CurrencyStats__ = __webpack_require__(22);



// import BigTable from './BigTable'




class FullMode extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  render() {
    const styles = this.getStyles()

    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.root }, [
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.column }, [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.currency }, [
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__CurrencyStats__["a" /* default */])(),
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.botLogBox }, [
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__BotLog__["a" /* default */])()
          ])
        ]),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.trade }, [
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__TradeTable__["a" /* default */])()
        ])
      ])
      // div({ style: styles.row }, [
      //   BigTable(({ ask }) => ({ data: ask }))(
      //     { title: 'Предложение', headers: [ 'Date', 'Price', 'ETH', 'USDT' ] }),
      //   BigTable(({ bid }) => ({ data: bid }))(
      //     { title: 'Спрос', headers: [ 'Date', 'Price', 'ETH', 'USDT' ] })
      // ])
    ])
  }

  getStyles() {
    return {
      root: {
      },
      column: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '1vh 2.5vw'
      },
      currency: {
        minWidth: '40vw'
      },
      trade: {
        minWidth: '35vw',
        maxWidth: '100vw',
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '1rem'
      },
      botLogBox: {
        minWidth: '42vw',
        maxWidth: '55vw',
        height: 'calc(83vh - 345px)',
        overflow: 'scroll'
      }
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["hh"])(FullMode);


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__);




const formatDate = time => {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const hoursStr = hours.toString().length > 1 ? hours : `0${hours}`
  const minutesStr = minutes.toString().length > 1 ? minutes : `0${minutes}`
  return `${hoursStr}:${minutesStr}`
}

class MyOrders extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {

  render() {
    const styles = this.getStyles()
    const headers = [ 'Time', 'Price', 'Amount', 'State' ]
    const { mySells, myFailureSells, myBuys, myFailureBuys } = this.props
    const data = [
      ...mySells.map(v => [ 'sell', ...v ]),
      ...myBuys.map(v => [ 'buy', ...v ]),
      ...myFailureBuys.map(v => [ 'fbuy', ...v ]),
      ...myFailureSells.map(v => [ 'fsell', ...v ])
    ].sort((a, b) => b[1] - a[1])

    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])([
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["table"])({ style: styles.table }, [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["tbody"])({ style: styles.tbody }, [
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["tr"])({ style: styles.tr }, headers.map(header =>
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["th"])({ style: styles.th }, header))),

          data.map((item, i) =>
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["tr"])({ key: i, style: styles.coloredTypedRow(item[0], item[5]) }, [
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["td"])(item[1] && formatDate(item[1])),
              item.map(((col, j) =>
                (j > 1 && j < 4 && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["td"])({ key: j, style: styles.td }, col)) ||
                (j === 4 && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["td"])({ key: j, style: styles.td }, (() => (
                  (col === 0 && 'Создано транзакцией') ||
                  (col === -1 && 'Создано вручную') ||
                  `Закрыто #${col}`
                ))()))
              ))
            ]))
        ])
      ]),
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: styles.map }, [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: { color: '#3c6a8e' } }, '● Открытая покупка'),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: { color: '#8e6e3c' } }, '● Открытая продажа'),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: { color: '#4b4f58' } }, '● Закрытая покупка'),
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: { color: '#3e362f' } }, '● Закрытая продажа'),
      ])
    ])
  }

  getStyles() {
    return {
      table: {
        width: '100%',
        maxHeight: '85vh',
        overflowY: 'auto',
        padding: '5vw'
      },
      th: {
        background: '#152126',
        padding: '.25rem 0'
      },
      td: {
        padding: '.1rem .5rem'
      },
      coloredTypedRow: (type, state) => ({
        background:
          (type === 'buy' && (state === 0 ? '#3c6a8e' : '#4b4f58')) ||
          (type === 'sell' && (state === 0 ? '#8e6e3c' : '#3e362f')) ||
          (type === 'fbuy' && '#d8544c') ||
          (type === 'fsell' && '#d8544c')
      }),
      map: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 5vw'
      }
    }
  }
}

const mapStateToProps = ({ mySells, myFailureSells, myBuys, myFailureBuys }) =>
  ({ mySells, myFailureSells, myBuys, myFailureBuys })

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["hh"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps)(MyOrders));


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__BotLog__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__SimpleRate__ = __webpack_require__(27);






class FullMode extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  render() {
    const styles = this.getStyles()

    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.root }, [
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__SimpleRate__["a" /* default */])(),
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.botLogBox }, [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__BotLog__["a" /* default */])()
      ])
    ])
  }

  getStyles() {
    return {
      root: {
        padding: '5vh 5vw'
      },
      botLogBox: {
        display: 'flex',
        justifyContent: 'center',
        minWidth: '80vw',
        maxWidth: '90vw',
        height: '75vh',
        overflowY: 'scroll'
      }
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["hh"])(FullMode);


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_const__ = __webpack_require__(4);





class SimpleRate extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  render() {
    const { currency } = this.props
    const styles = this.getStyles()

    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: styles.root }, [
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: styles.last }, currency && currency.last)
    ])
  }

  getStyles() {
    return {
      root: {
        minWidth: '100%',
        textAlign: 'center'
      },
      last: {
        fontSize: '4.5rem',
        lineHeight: '3rem',
        margin: '1rem 0 2.5rem 0',
        color: '#e352c9'
      }
    }
  }
}

const mapStateToProps = ({ currencies }) =>
  ({ currency: currencies[__WEBPACK_IMPORTED_MODULE_3_const__["a" /* CURRENT_PAIR */]] })

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["hh"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps)(SimpleRate));


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_throttle_render__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_throttle_render___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_throttle_render__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_deep_equal__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_deep_equal___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_deep_equal__);





const formatDate = time => {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const hoursStr = hours.toString().length > 1 ? hours : `0${hours}`
  const minutesStr = minutes.toString().length > 1 ? minutes : `0${minutes}`
  return `${hoursStr}:${minutesStr}`
}


class Table extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  shouldComponentUpdate(nextProps) {
    return !__WEBPACK_IMPORTED_MODULE_3_deep_equal___default()(nextProps.data, this.props.data)
  }

  render() {
    const { data, title, headers } = this.props
    const styles = this.getStyles()

    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.root }, [
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["div"])({ style: styles.title }, title),
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["table"])({ style: styles.table }, [
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["tbody"])({ style: styles.tbody }, [
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["tr"])({ style: styles.tr }, headers.map(header =>
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["th"])({ style: styles.th }, header))),

          data.map((item, i) =>
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["tr"])({ key: i, style: styles.coloredTypedRow(item.type) }, [
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["td"])(item[0] && formatDate(item[0])),
              item.map(((col, j) =>
                j > 0 && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["td"])({ key: j, style: styles.td }, col)))
            ]))
        ])
      ])
    ])
  }

  getStyles() {
    return {
      root: {
      },
      table: {
      },
      thead: {

      },
      th: {
        background: '#152126',
        padding: '.25rem 0'
      },
      td: {
        padding: '.1rem .5rem'
      },
      tbody: {
        display: 'block'
      },
      title: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#f6f8b7'
      },
      coloredTypedRow: type => {
        switch (type) {
          case 'sell': return { background: '#82373b' }
          case 'buy': return { background: '#6e8436' }
          default: return {}
        }
      }
    }
  }
}

Table.propTypes = {
  data: __WEBPACK_IMPORTED_MODULE_0_react__["PropTypes"].oneOfType([
    __WEBPACK_IMPORTED_MODULE_0_react__["PropTypes"].object,
    __WEBPACK_IMPORTED_MODULE_0_react__["PropTypes"].array
  ]),
  headers: __WEBPACK_IMPORTED_MODULE_0_react__["PropTypes"].array,
  title: __WEBPACK_IMPORTED_MODULE_0_react__["PropTypes"].string
}

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_hyperscript_helpers__["hh"])(__WEBPACK_IMPORTED_MODULE_2_react_throttle_render___default()(1000)(Table));


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Table__ = __webpack_require__(28);





class TradeTable extends __WEBPACK_IMPORTED_MODULE_0_react__["Component"] {
  render() {
    const { data, currentPair } = this.props
    const pairNames = currentPair.split('_')

    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["div"])({ style: { overflowY: 'scroll', height: '87vh' } }, [
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__Table__["a" /* default */])({ data, headers: [ 'Date', `Price ${pairNames[0]}`, `Amount ${pairNames[1]}`, `Total ${pairNames[0]}` ] })
    ])
  }
}

const mapStateToProps = ({ buy, sell, currentPair }) => {
  const partOfSells = sell
    .slice(sell.length - 150, sell.length - 1)
    .map(v => Object.defineProperty(v, 'type', { value: 'sell', enumerable: false }))

  const partOfBuys = buy
    .slice(buy.length - 150, buy.length - 1)
    .map(v => Object.defineProperty(v, 'type', { value: 'buy', enumerable: false }))

  const mergedArrays = [ ...partOfSells, ...partOfBuys ].sort().reverse()

  return { data: mergedArrays, currentPair }
}

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_hyperscript_helpers__["hh"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(mapStateToProps)(TradeTable));


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* eslint import/prefer-default-export: 0 */

const formatDate = time => {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const hoursStr = hours.toString().length > 1 ? hours : `0${hours}`
  const minutesStr = minutes.toString().length > 1 ? minutes : `0${minutes}`
  return `${hoursStr}:${minutesStr}`
}
/* harmony export (immutable) */ __webpack_exports__["a"] = formatDate;



/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const renderFullPage = (html, preloadedState) => `
  <!doctype html>
  <html>
    <head>
      <title>Redux Universal Example</title>
    </head>
    <body style="margin:0">
      <div id="root">${html}</div>
      <script>
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
      </script>
      <script src="/bundle.js"></script>
    </body>
  </html>
`

/* harmony default export */ __webpack_exports__["a"] = renderFullPage;


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_saga_effects___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__poloniex_public__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stats__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__trade__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__wallet__ = __webpack_require__(35);
/* harmony export (immutable) */ __webpack_exports__["a"] = root;

// import poloniexPrivateSaga from './poloniex-private'





function* root() {
  yield [
    // fork(poloniexPrivateSaga),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(__WEBPACK_IMPORTED_MODULE_1__poloniex_public__["a" /* default */]),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(__WEBPACK_IMPORTED_MODULE_2__stats__["a" /* default */]),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(__WEBPACK_IMPORTED_MODULE_3__trade__["a" /* default */]),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(__WEBPACK_IMPORTED_MODULE_4__wallet__["a" /* default */])
  ]
}


/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_saga_effects___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_saga__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_saga___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux_saga__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_server_services_poloniex_wss__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_shared_actions__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_const__ = __webpack_require__(4);
/* harmony export (immutable) */ __webpack_exports__["a"] = poloniexPublicSaga;






const channel = (session, topic) => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_redux_saga__["eventChannel"])(emitter => {
  const sub = session.subscribe(topic, emitter)
  return () => session.unsubscribe(sub)
})

/* eslint no-unused-vars: 1 */
function* channelUsdtDash(session) {
  try {
    // const currencyPair = yield select(selectCurrentPair)
    const currChan = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["call"])(channel, session, __WEBPACK_IMPORTED_MODULE_4_const__["a" /* CURRENT_PAIR */])
    while (true) {
      const data = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["take"])(currChan)
      /* eslint no-restricted-syntax: 0 */
      for (const item of data) {
        if (item.data.type === 'sell' || item.data.type === 'buy') {
          switch (item.type) {
            case 'orderBookRemove':
              yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_shared_actions__["v" /* orderBookRemove */])(item.data))
              break
            case 'orderBookModify':
              yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_shared_actions__["w" /* orderBookModify */])(item.data))
              break
            case 'newTrade':
              yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_shared_actions__["x" /* newTrade */])(item.data))
              break
            default:
              break
          }
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}

function* channelTicker(session) {
  try {
    const chanTicker = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["call"])(channel, session, 'ticker')
    let lastTickerValue = 0

    while (true) {
      const data = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["take"])(chanTicker)
      if (data[0] === __WEBPACK_IMPORTED_MODULE_4_const__["a" /* CURRENT_PAIR */]) {
        if (data[1] !== lastTickerValue) {
          yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_shared_actions__["q" /* setCurrency */])(data))
        }
        lastTickerValue = data[1]
      }
    }
  } catch (err) {
    console.log(err)
  }
}

function* bootstrap(session) {
  yield [
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(channelUsdtDash, session),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(channelTicker, session)
  ]
}

function* poloniexPublicSaga() {
  try {
    const session = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["call"])(__WEBPACK_IMPORTED_MODULE_2_server_services_poloniex_wss__["a" /* default */])
    yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(bootstrap, session)
  } catch (err) {
    console.log('WSS Disconnected')
  }
}


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_saga_effects___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_shared_actions__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bignumber_js__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_bignumber_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_bignumber_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_server_utils__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_const__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__selectors__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__trade__ = __webpack_require__(11);
/* unused harmony export generateStatsSaga */
/* unused harmony export estimateStatsSaga */
/* unused harmony export conclusionStatsSaga */
/* harmony export (immutable) */ __webpack_exports__["a"] = StatsSaga;








const getRate = i => i[1]
const getSumm = (a, b) => a + b
const bigToNumber = bn => bn.toNumber()
const calcRelativeDynamic = (prev, curr, index) =>
  index === 1 ?
    [ [ new __WEBPACK_IMPORTED_MODULE_2_bignumber_js___default.a(curr).div(prev) ], curr ] :
    [ [ ...prev[0], new __WEBPACK_IMPORTED_MODULE_2_bignumber_js___default.a(curr).div(prev[1]) ], curr ]

const getRateChange = arr => arr
  .map(getRate)
  .reduce(calcRelativeDynamic)[0]
  .map(bigToNumber)
  .reduce(getSumm) / arr.length


function* generateStatsSaga() {
  const { last } = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_5__selectors__["b" /* selectCurrencyPair */])
  const buys = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_5__selectors__["f" /* selectBuysLastTime */], __WEBPACK_IMPORTED_MODULE_4_const__["b" /* TEN_MINUTES */])
  const sells = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_5__selectors__["g" /* selectSellsLastTime */], __WEBPACK_IMPORTED_MODULE_4_const__["b" /* TEN_MINUTES */])

  if (buys.length >= 2 && sells.length >= 2) {
    // увеличивается - курс поднимают, чем выше, тем активнее поднимают
    const buyChange = getRateChange(buys)
    // уменьшается - курс активно сваливают, чем ниже, тем сильнее обваливают,
    // поднимается - просто торгуют, курс увеличивается
    const sellChange = getRateChange(sells)

    const currentRate = Number(last)

    yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_shared_actions__["s" /* addStats */])([ currentRate, buyChange, sellChange ]))
  }
}

function* estimateStatsSaga() {
  while (true) {
    yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["take"])(__WEBPACK_IMPORTED_MODULE_1_shared_actions__["s" /* addStats */])
    const lastTenStats = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_5__selectors__["h" /* selectLastTenStats */])

    if (lastTenStats.length >= 10) {
      const buyChangeFinal = lastTenStats.map(v => v[1]).reduce((a, b) => a * b)
      const sellChangeFinal = lastTenStats.map(v => v[2]).reduce((a, b) => a * b)
      const finalRatio = sellChangeFinal / buyChangeFinal
      yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_shared_actions__["t" /* addEstimateRatio */])(finalRatio))
    }
  }
}

function* conclusionStatsSaga() {
  let lastResult

  while (true) {
    yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["take"])(__WEBPACK_IMPORTED_MODULE_1_shared_actions__["t" /* addEstimateRatio */])
    const { lowestAsk, highestBid } = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_5__selectors__["b" /* selectCurrencyPair */])
    const hold = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_5__selectors__["i" /* selectThreshold */])
    const estimates = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_5__selectors__["j" /* selectEstimateRatios */])
    const result = estimates.reduce((prev, curr) =>
      (prev[0] <= curr ? [ curr, prev[1] + 1 ] : [ curr, prev[1] - 1 ]),
      [ 0, 0 ]
    )[1]

    if ((lastResult >= 9 && result <= 9) || (lastResult >= 2 && result <= 1)) {
      yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(__WEBPACK_IMPORTED_MODULE_6__trade__["b" /* sellSaga */], __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_server_utils__["a" /* cropNumber */])(Number(highestBid) - 0.00000001), hold)
    }

    if ((lastResult <= -9 && result <= -8) || (lastResult <= -2 && result >= 0)) {
      yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(__WEBPACK_IMPORTED_MODULE_6__trade__["c" /* buySaga */], __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_server_utils__["a" /* cropNumber */])(Number(lowestAsk) + 0.00000001), hold)
    }

    yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_shared_actions__["u" /* setCurrentFinalResult */])(result))

    if (lastResult >= 9 && result <= 9) console.log('Идём на спад, продаём', highestBid)
    if (lastResult >= 2 && result <= 1) console.log('Скоро упадём, продаём?', highestBid)

    if (lastResult <= -9 && result <= -8) console.log('Идём вверх, покупаем', lowestAsk)
    if (lastResult <= -2 && result >= 0) console.log('Скоро поднимемся, можно купить', lowestAsk)

    lastResult = result
  }
}

function* StatsSaga() {
  yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["throttle"])(5000, __WEBPACK_IMPORTED_MODULE_1_shared_actions__["q" /* setCurrency */], generateStatsSaga)
  yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(estimateStatsSaga)
  yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(conclusionStatsSaga)
}


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_saga_effects___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_server_services_poloniex__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_server_services_poloniex___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_server_services_poloniex__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_server_utils__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_const__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_server_sagas_selectors__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_shared_actions__ = __webpack_require__(2);
/* unused harmony export watchForNewChunks */
/* unused harmony export doBuySaga */
/* unused harmony export doSellSaga */
/* unused harmony export getWallet */
/* unused harmony export calculateFreeValues */
/* harmony export (immutable) */ __webpack_exports__["a"] = walletSaga;









const { ACCOUNT: { key, secret } } = __webpack_require__.i({"NODE_ENV":"production","BROWSER":false,"ACCOUNT":{"pair":"BTC_ETH","key":"I94AGT6H-HEUAIL5B-G34YF99I-IYR0777F","secret":"758c86f9c922e164f573801663f641acb625e4118f646f0b5612da38cd18a171716d580af12104c3719b935b2cf1510f6df3359e28f403e9bf32e2cbe2faa97f"}})
const poloniex = new __WEBPACK_IMPORTED_MODULE_1_server_services_poloniex___default.a({ key, secret })
/* unused harmony export poloniex */


function* watchForNewChunks() {
  const makeChunks = (rate, amount, chunksNum) => {
    /* eslint no-plusplus: 0 */
    let quantity = chunksNum
    const chunks = []
    while (quantity--) chunks.push([ rate, amount ])
    return chunks
  }

  while (true) {
    const { sellChunks, buyChunks } = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["race"])({
      sellChunks: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["take"])(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["b" /* sendSells */]),
      buyChunks: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["take"])(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["c" /* sendBuys */])
    })

    const [ firstCurrency, secondCurrency ] = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_4_server_sagas_selectors__["a" /* selectCurrentPair */])

    if (sellChunks) {
      const { rate, amount, chunksNum } = sellChunks.payload
      const chunksToSell = makeChunks(rate, amount, chunksNum)

      yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["f" /* addSellChunks */])(chunksToSell))
      yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["g" /* addChunkedCurrency */])([ firstCurrency, amount * chunksNum ]))
      yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["h" /* botMessage */])(`Созданы продажи в количестве ${chunksNum} частей по ${amount} ${secondCurrency}`))
    } else if (buyChunks) {
      const { rate, amount, chunksNum } = buyChunks.payload
      const chunksToBuy = makeChunks(rate, amount, chunksNum)

      yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["i" /* addBuyChunks */])(chunksToBuy))
      yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["g" /* addChunkedCurrency */])([ secondCurrency, amount * chunksNum ]))
      yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["h" /* botMessage */])(`Созданы покупки в количестве ${chunksNum} частей по ${amount} ${secondCurrency}`))
    }
  }
}

function* doBuySaga() {
  while (true) {
    try {
      const { payload: [ rate, amount, coverIndex ] } = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["take"])(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["j" /* doBuy */])
      const options = { command: 'buy', currencyPair: __WEBPACK_IMPORTED_MODULE_3_const__["a" /* CURRENT_PAIR */], rate, amount }
      const { response, error } = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["call"])(poloniex.privateRequest, options)

      response && response.orderNumber ?
        yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["k" /* buySuccess */])([ rate, amount, coverIndex, response.orderNumber ])) :
        yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["l" /* buyFailure */])([ rate, amount, error || response.error ]))
    } catch (err) {
      console.log({ err })
    }
  }
}

function* doSellSaga() {
  while (true) {
    try {
      const { payload: [ rate, amount, coverIndex ] } = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["take"])(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["m" /* doSell */])
      const options = { command: 'sell', currencyPair: __WEBPACK_IMPORTED_MODULE_3_const__["a" /* CURRENT_PAIR */], rate, amount }
      const { response, error } = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["call"])(poloniex.privateRequest, options)

      response && response.orderNumber ?
        yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["n" /* sellSuccess */])([ rate, amount, coverIndex, response.orderNumber ])) :
        yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["o" /* sellFailure */])([ rate, amount, error || response.error ]))
    } catch (err) {
      console.log({ err })
    }
  }
}

function* getWallet() {
  const { response } = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["call"])(poloniex.privateRequest, { command: 'returnBalances' })
  yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["p" /* updateWallet */])(response))
}

function* calculateFreeValues() {
  while (true) {
    yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["take"])([ __WEBPACK_IMPORTED_MODULE_5_shared_actions__["q" /* setCurrency */], __WEBPACK_IMPORTED_MODULE_5_shared_actions__["c" /* sendBuys */], __WEBPACK_IMPORTED_MODULE_5_shared_actions__["b" /* sendSells */] ])

    const [ firstCurrency, secondCurrency ] = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_4_server_sagas_selectors__["a" /* selectCurrentPair */])
    const { last } = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_4_server_sagas_selectors__["b" /* selectCurrencyPair */])
    const wallet = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_4_server_sagas_selectors__["c" /* selectWallet */])
    const uncoveredSells = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_4_server_sagas_selectors__["d" /* selectUncoveredSells */])
    const uncoveredBuys = yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["select"])(__WEBPACK_IMPORTED_MODULE_4_server_sagas_selectors__["e" /* selectUncoveredBuys */])

    const volumeOfSellChunks = uncoveredSells.reduce((prev, curr) =>
      (curr[4] === 0 ? prev + curr[2] : prev), 0)

    const volumeOfBuyChunks = uncoveredBuys.reduce((prev, curr) =>
      (curr[4] === 0 ? prev + curr[2] : prev), 0)

    const firstFreeVolume = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_server_utils__["a" /* cropNumber */])((wallet[firstCurrency] - volumeOfSellChunks) * last)
    const secondFreeVolume = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_server_utils__["a" /* cropNumber */])(wallet[secondCurrency] - volumeOfBuyChunks)

    yield __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["put"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_shared_actions__["r" /* setFreeCurrencies */])([ firstFreeVolume, secondFreeVolume ]))
  }
}

function* walletSaga() {
  yield [
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(getWallet),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(watchForNewChunks),
    // fork(calculateFreeValues),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(doBuySaga),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_saga_effects__["fork"])(doSellSaga)
  ]
}


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

const HmacSHA512 = __webpack_require__(43)
const nonce = __webpack_require__(47)()

if (true) {
  /* eslint global-require: 0 */
  global.fetch = __webpack_require__(46)
}


const keySymbol = Symbol('key')
const secretSymbol = Symbol('secret')
// const PUBLIC_API_URL = 'https://poloniex.com/public'
const PRIVATE_API_URL = 'https://poloniex.com/tradingApi'

class Poloniex {
  constructor({ key, secret }) {
    this[keySymbol] = key
    this[secretSymbol] = secret
    this.privateRequest = this.privateRequest.bind(this)
  }

  static toParamsString(props) {
    const e = encodeURIComponent
    return Object.keys(props).map(prop => `${e(prop)}=${e(props[prop])}`).join('&')
  }

  getPrivateHeaders(paramsString) {
    const signature = HmacSHA512(paramsString, this[secretSymbol]).toString()
    return {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Key: this[keySymbol],
      Sign: signature
    }
  }

  static request(options) {
    return fetch(options.url, options)
      .then(response => response.json().then(json => ({ json, response })))
      .then(({ json, response }) => {
        if (!response.ok) return { error: json.error || 'Network response was not ok.' }
        return { response: json }
      })
      .catch(error => ({ error }))
  }

  privateRequest(props) {
    const propsWithNonce = Object.assign({}, props, { nonce: nonce(16) })
    const paramsString = Poloniex.toParamsString(propsWithNonce)
    const options = {
      method: 'POST',
      url: PRIVATE_API_URL,
      body: paramsString,
      headers: this.getPrivateHeaders(paramsString)
    }
    return Poloniex.request(options)
  }
}

module.exports = Poloniex


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_autobahn__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_autobahn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_autobahn__);


/* harmony default export */ __webpack_exports__["a"] = () => new Promise((resolve, reject) => {
  const connection = new __WEBPACK_IMPORTED_MODULE_0_autobahn___default.a.Connection({
    url: 'wss://api.poloniex.com',
    realm: 'realm1',
    use_es6_promises: true,
    retry_delay_jitter: 1
  })
  connection.onopen = resolve
  connection.onclose = reject
  connection.open()
});


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__publicLogs__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__myOrders__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__wallet__ = __webpack_require__(41);






const rootReducer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])({
  botMessages: __WEBPACK_IMPORTED_MODULE_3__wallet__["a" /* botMessages */],
  buy: __WEBPACK_IMPORTED_MODULE_1__publicLogs__["a" /* buy */],
  currencies: __WEBPACK_IMPORTED_MODULE_3__wallet__["b" /* currencies */],
  currentPair: __WEBPACK_IMPORTED_MODULE_3__wallet__["c" /* currentPair */],
  finalCurrentResult: __WEBPACK_IMPORTED_MODULE_3__wallet__["d" /* finalCurrentResult */],
  freeCurrencies: __WEBPACK_IMPORTED_MODULE_3__wallet__["e" /* freeCurrencies */],
  myBuys: __WEBPACK_IMPORTED_MODULE_2__myOrders__["a" /* myBuys */],
  myFailureBuys: __WEBPACK_IMPORTED_MODULE_2__myOrders__["b" /* myFailureBuys */],
  myFailureSells: __WEBPACK_IMPORTED_MODULE_2__myOrders__["c" /* myFailureSells */],
  mySells: __WEBPACK_IMPORTED_MODULE_2__myOrders__["d" /* mySells */],
  sell: __WEBPACK_IMPORTED_MODULE_1__publicLogs__["b" /* sell */],
  stats: __WEBPACK_IMPORTED_MODULE_3__wallet__["f" /* stats */],
  statsEstimate: __WEBPACK_IMPORTED_MODULE_3__wallet__["g" /* statsEstimate */],
  threshold: __WEBPACK_IMPORTED_MODULE_3__wallet__["h" /* threshold */],
  wallet: __WEBPACK_IMPORTED_MODULE_3__wallet__["i" /* wallet */]
})

/* harmony default export */ __webpack_exports__["a"] = rootReducer;


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_act__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_act___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux_act__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions__ = __webpack_require__(2);
/* eslint no-unused-vars: 0 */




const myBuys = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_2__actions__["k" /* buySuccess */]]: (state, [ rate, amount, coverIndex, orderNumber ]) =>
    [ ...state, [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["a" /* time */])(), rate, amount, 0, 0 ] ],

  [__WEBPACK_IMPORTED_MODULE_2__actions__["n" /* sellSuccess */]]: (state, [ rate, amount, coverIndex, orderNumber ]) => [
    ...state
      .filter(v => v[4] === 0)
      .map((v, i) => i === coverIndex ? [ ...v.slice(0, 3), orderNumber, 1 ] : v),
    ...state.filter(v => v[4] !== 0)
  ].sort(),

  [__WEBPACK_IMPORTED_MODULE_2__actions__["i" /* addBuyChunks */]]: (state, data) => [ ...state, ...data.map(v => [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["a" /* time */])(), ...v, -1, 0 ]) ],
  [__WEBPACK_IMPORTED_MODULE_2__actions__["d" /* removeOpenBuys */]]: (state) => state.filter(v => v[4] !== 0)
}, [])
/* harmony export (immutable) */ __webpack_exports__["a"] = myBuys;


// TODO: хранить транзакции в виде объектов с уникальными id
const mySells = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_2__actions__["n" /* sellSuccess */]]: (state, [ rate, amount, coverIndex, orderNumber ]) =>
    [ ...state, [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["a" /* time */])(), rate, amount, 0, 0 ] ],

  [__WEBPACK_IMPORTED_MODULE_2__actions__["k" /* buySuccess */]]: (state, [ rate, amount, coverIndex, orderNumber ]) => [
    ...state
      .filter(v => v[4] === 0)
      .map((v, i) => i === coverIndex ? [ ...v.slice(0, 3), orderNumber, 1 ] : v),
    ...state.filter(v => v[4] !== 0)
  ].sort(),

  [__WEBPACK_IMPORTED_MODULE_2__actions__["f" /* addSellChunks */]]: (state, data) => [ ...state, ...data.map(v => [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["a" /* time */])(), ...v, -1, 0 ]) ],
  [__WEBPACK_IMPORTED_MODULE_2__actions__["e" /* removeOpenSells */]]: (state) => state.filter(v => v[4] !== 0)
}, [])
/* harmony export (immutable) */ __webpack_exports__["d"] = mySells;


const myFailureSells = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_2__actions__["o" /* sellFailure */]]: (state, data) => [ ...state, [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["a" /* time */])(), ...data ] ]
}, [])
/* harmony export (immutable) */ __webpack_exports__["c"] = myFailureSells;


const myFailureBuys = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_2__actions__["l" /* buyFailure */]]: (state, data) => [ ...state, [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["a" /* time */])(), ...data ] ]
}, [])
/* harmony export (immutable) */ __webpack_exports__["b"] = myFailureBuys;



/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_act__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_act___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux_act__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions__ = __webpack_require__(2);





const TWENTY_MINUTES = 1000 * 60 * 20

const buy = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_2__actions__["x" /* newTrade */]]: (state, { type, rate, amount, total }) =>
    type === 'buy' ? [ ...state, [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["a" /* time */])(), rate, amount, total ] ] : state
}, [])
/* harmony export (immutable) */ __webpack_exports__["a"] = buy;


const sell = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_2__actions__["x" /* newTrade */]]: (state, { type, rate, amount, total }) =>
    type === 'sell' ? [ ...state, [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["a" /* time */])(), rate, amount, total ] ] : state
}, [])
/* harmony export (immutable) */ __webpack_exports__["b"] = sell;


const ask = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_2__actions__["x" /* newTrade */]]: (state, { type, rate, amount }) =>
    type === 'ask' && (state.length > 0 || amount) ?
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["b" /* getOnlyLast */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["c" /* mergeOnAmount */])(state, rate, amount), TWENTY_MINUTES) :
      state,

  [__WEBPACK_IMPORTED_MODULE_2__actions__["w" /* orderBookModify */]]: (state, { type, rate, amount }) =>
    type === 'ask' && (state.length > 0 || amount) ?
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["b" /* getOnlyLast */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["c" /* mergeOnAmount */])(state, rate, amount), TWENTY_MINUTES) :
      state,

  [__WEBPACK_IMPORTED_MODULE_2__actions__["v" /* orderBookRemove */]]: (state, { type, rate }) =>
    type === 'ask' ?
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["d" /* removeIndex */])(state, state.findIndex(e => e[0] === rate)) :
      state
}, [])
/* unused harmony export ask */


const bid = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_2__actions__["x" /* newTrade */]]: (state, { type, rate, amount }) =>
    type === 'bid' && (state.length > 0 || amount) > 0 ?
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["b" /* getOnlyLast */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["c" /* mergeOnAmount */])(state, rate, amount), TWENTY_MINUTES) :
      state,

  [__WEBPACK_IMPORTED_MODULE_2__actions__["w" /* orderBookModify */]]: (state, { type, rate, amount }) =>
    type === 'bid' && (state.length > 0 || amount) > 0 ?
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["b" /* getOnlyLast */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["c" /* mergeOnAmount */])(state, rate, amount), TWENTY_MINUTES) :
      state,

  [__WEBPACK_IMPORTED_MODULE_2__actions__["v" /* orderBookRemove */]]: (state, { type, rate }) =>
    type === 'bid' ?
      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__helpers__["d" /* removeIndex */])(state, state.findIndex(e => e[0] === rate)) :
      state
}, [])
/* unused harmony export bid */



/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_act__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux_act___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux_act__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers__ = __webpack_require__(9);




const { ACCOUNT: { pair } } = __webpack_require__.i({"NODE_ENV":"production","BROWSER":false,"ACCOUNT":{"pair":"BTC_ETH","key":"I94AGT6H-HEUAIL5B-G34YF99I-IYR0777F","secret":"758c86f9c922e164f573801663f641acb625e4118f646f0b5612da38cd18a171716d580af12104c3719b935b2cf1510f6df3359e28f403e9bf32e2cbe2faa97f"}})

const wallet = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_1__actions__["p" /* updateWallet */]]: (state, data) =>
    Object.keys(data).reduce((prev, key) =>
      (data[key] !== '0.00000000' ? Object.assign({}, prev, { [key]: data[key] }) : prev), {})
}, {})
/* harmony export (immutable) */ __webpack_exports__["i"] = wallet;


const currencies = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  /* eslint max-len: 0 */
  [__WEBPACK_IMPORTED_MODULE_1__actions__["q" /* setCurrency */]]: (state, [ currencyPair, last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow ]) =>
    Object.assign({}, state, {
      [currencyPair]: { last, lowestAsk, highestBid, percentChange, baseVolume, quoteVolume, isFrozen, hrHigh, hrLow }
    })
}, {})
/* harmony export (immutable) */ __webpack_exports__["b"] = currencies;


const freeCurrencies = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_1__actions__["r" /* setFreeCurrencies */]]: (state, values) => values
}, [])
/* harmony export (immutable) */ __webpack_exports__["e"] = freeCurrencies;


const threshold = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_1__actions__["a" /* setThreshold */]]: (state, value) => value
}, 0.0001)
/* harmony export (immutable) */ __webpack_exports__["h"] = threshold;


const currentPair = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_1__actions__["y" /* setCurrencyPair */]]: state => state
}, pair)
/* harmony export (immutable) */ __webpack_exports__["c"] = currentPair;


const stats = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_1__actions__["s" /* addStats */]]: (state, data) => [ ...state, data ]
}, [])
/* harmony export (immutable) */ __webpack_exports__["f"] = stats;


const statsEstimate = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_1__actions__["t" /* addEstimateRatio */]]: (state, data) => [ ...state, data ]
}, [])
/* harmony export (immutable) */ __webpack_exports__["g"] = statsEstimate;


const finalCurrentResult = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_1__actions__["u" /* setCurrentFinalResult */]]: (state, data) => data
}, 0)
/* harmony export (immutable) */ __webpack_exports__["d"] = finalCurrentResult;


const botMessages = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux_act__["createReducer"])({
  [__WEBPACK_IMPORTED_MODULE_1__actions__["h" /* botMessage */]]: (state, msg) => msg !== state[state.length - 1][1] ?
    [ ...state, [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__helpers__["a" /* time */])(), msg ] ] :
    state
}, [ [ __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__helpers__["a" /* time */])(), 'Initiated' ] ])
/* harmony export (immutable) */ __webpack_exports__["a"] = botMessages;



/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = require("autobahn");

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = require("crypto-js/hmac-sha512");

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = require("debounce");

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = require("deep-equal");

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = require("node-fetch");

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = require("nonce");

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = require("pouchdb");

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = require("react-router");

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = require("react-throttle-render");

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = require("redux-pouchdb");

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__store__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__renderer__ = __webpack_require__(16);




const run = worker => {
  console.log('Worker PID:', process.pid)

  const { httpServer, scServer } = worker
  const app = __WEBPACK_IMPORTED_MODULE_0_express___default()()
  const store = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__store__["a" /* default */])(scServer)

  app.use(__WEBPACK_IMPORTED_MODULE_0_express___default.a.static('public', { maxAge: 1000 }))
  // app.use(express.static('public', { maxAge: 86400000 * 365, index: false }))
  // app.use(express.static('public', { index: 'index.html' }))
  app.use(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__renderer__["a" /* default */])(store))

  httpServer.on('request', app)
}
/* harmony export (immutable) */ __webpack_exports__["run"] = run;



/***/ })
/******/ ])));
//# sourceMappingURL=worker_bundle.js.map