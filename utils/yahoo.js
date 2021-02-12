'use strict';


const axios = require("axios");
const yahooDataPicker = require("./yahooPickData");
const logger = require("./logger");


const PLACEHOLDER = "yahoo.js"
// Example 1: Creating a new class (declaration-form)
// ===============================================================

// A base class is defined using the new reserved 'class' keyword
module.exports = class YahooClient {
    // ..and an (optional) custom class constructor. If one is
    // not supplied, a default constructor is used instead:
    // constructor() { }
    constructor(rapidApiKey, rapidApiHost) {
        this.rapidApiKey = rapidApiKey;
        this.rapidApiHost = rapidApiHost;
        this.stockData = {

        }
    }


    callApi_get_cash_flow(symbol, cb) {
        try {

            // const url = "https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-cash-flow?symbol=GOOG&region=US"
            // const headers = {
            //     "x-rapidapi-host": this.rapidApiHost,
            //     "x-rapidapi-key": this.rapidApiKey,
            //     "useQueryString": true
            // }
            axios.get("https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-cash-flow?symbol=GOOG&region=US",
                {
                    headers: {
                        "x-rapidapi-host": this.rapidApiHost,
                        "x-rapidapi-key": this.rapidApiKey,
                        "useQueryString": true
                    }
                })
                .then(function (data) {
                    logger.INFO(PLACEHOLDER, "fetched data from https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-cash-flow?symbol=" + symbol + "&region=US")
                    cb(data)
                })
                .catch(function (e) {
                    logger.ERROR(PLACEHOLDER, e)

                })
        }
        catch (e) {
            logger.ERROR(PLACEHOLDER, e)
        }
    }


    getSymbolData(symbol, cb) {
        try {

            logger.INFO(PLACEHOLDER, "in symbolData for symbol:" + symbol)

            if (Object.keys(this.stockData).indexOf(symbol) < 0) {
                this.callApi_get_cash_flow(symbol, function (data) {


                    let jsonObject = data;
                    if (typeof jsonObject !== "object")
                        jsonObject = JSON.parse(data);


                    const pickedData = yahooDataPicker.helpers.buildSymbolStats(jsonObject)
                    this.stockData = {
                        ...this.stockData,
                        [symbol]: pickedData
                    }
                    logger.INFO(PLACEHOLDER, "data after build:" + JSON.stringify(this.stockData[symbol]))
                    return cb(this.stockData[symbol])



                })
            }
            else
                return cb(this.stockData[symbol])

        }
        catch (e) {
            logger.ERROR(PLACEHOLDER, e)
        }
    }



    getStocksData() {
        logger.INFO(PLACEHOLDER, JSON.stringify(this.stockData))
        return this.stockData
    }




} 