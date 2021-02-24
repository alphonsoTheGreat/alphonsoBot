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


            axios.get("https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-cash-flow?symbol=" + symbol + "&region=US",
                {
                    headers: {
                        "x-rapidapi-host": this.rapidApiHost,
                        "x-rapidapi-key": this.rapidApiKey,
                        "useQueryString": true
                    }
                })
                .then(function ({ data }) {

                    logger.INFO(PLACEHOLDER, "fetched data from https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-cash-flow?symbol=" + symbol + "&region=US")
                    cb(data)
                })
                .catch(function (e) {
                    const data = e.response.data
                    logger.ERROR(PLACEHOLDER, data)

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
                this.callApi_get_cash_flow(symbol, (data) => {


                    let jsonObject = data;
                    if (typeof jsonObject !== "object")
                        jsonObject = JSON.parse(data);

                    const pickedData = yahooDataPicker.buildSymbolStats(jsonObject);
                    console.log({ pickedData });
                    const prettyPickedData = this.pretty(pickedData);
                    this.stockData = {
                        ...this.stockData,
                        [symbol]: pickedData
                    }
                    // logger.INFO(PLACEHOLDER, "data after build:" + JSON.stringify(pickedData))
                    // logger.INFO(PLACEHOLDER, "data after build:" + JSON.stringify(this.stockData[symbol]))
                    return cb(prettyPickedData)
                    // return cb(this.stockData[symbol])



                })
            }
            else {
                logger.INFO(PLACEHOLDER, "fetching stock(" + symbol + ") data from memory")
                return cb(this.stockData[symbol])
            }

        }
        catch (e) {
            logger.ERROR(PLACEHOLDER, e)
        }
    }



    getStocksData() {
        // logger.INFO(PLACEHOLDER, JSON.stringify(this.stockData))
        const data = this.stockData;
        console.log({ getStocksData: data });
        const stocks = Object.keys(data)
        return stocks.map(s => this.pretty(this.stockData[s]))
    }

    pretty(data) {
        let keyValue = data.map(({ key, value }) => {

            const prettyKey = key.split("_").length > 1 ? key.split("_").join(" ") : key;

            if (prettyKey.split(" ")[0] === "calc" || prettyKey.split(" ")[0] === "FCS" || key === yahooDataPicker.rowValueMap.FCS_CAP || key === yahooDataPicker.rowValueMap.FCS_earningsAvg)
                return prettyKey + ": " + (value * 100).toFixed(3) + "%"

            return prettyKey + ": " + value

        })
        return keyValue.join("\n\n")

    }




} 