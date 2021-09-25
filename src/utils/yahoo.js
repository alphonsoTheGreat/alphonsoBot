'use strict';


const axios = require("axios");
const yahooDataPicker = require("./yahooPickData");
const { numberToPercentage } = require("./helpers")
const consts  = require("./consts")
const logger = require("./logger");


const PLACEHOLDER = "yahoo.js"

module.exports = class YahooClient {
    constructor(rapidApiKey, rapidApiHost) {
        this.rapidApiKey = rapidApiKey;
        this.rapidApiHost = rapidApiHost;
        this.stockData = {
        }
    }


    callApi_get_cash_flow(symbol, cb) {
        try {

            const isDev = process.env.NODE_ENV === consts.env.development;

            if (!isDev) {
                axios.get(consts.urls.getCashFlow + "?symbol=" + symbol + "&region=US",
                    {
                        headers: {
                            "x-rapidapi-host": this.rapidApiHost,
                            "x-rapidapi-key": this.rapidApiKey,
                            "useQueryString": true
                        }
                    })
                    .then(function ({ data }) {

                        logger.INFO(PLACEHOLDER, "fetched data from " + consts.urls.getCashFlow + "?symbol=" + symbol + "&region=US")
                        cb(data)
                    })
                    .catch(function (e) {
                        const data = e.response.data
                        logger.ERROR(PLACEHOLDER, data)

                    })
            }
            else {
                logger.INFO(PLACEHOLDER, "sending goog dummy data")
                const googDummy = require("./data.GOOG.ignore");
                cb(googDummy)
            }
        }
        catch (e) {
            logger.ERROR(PLACEHOLDER, e)
        }
    }




    getSymbolData(symbol, htmlStyled = false, cb) {
        try {

            logger.INFO(PLACEHOLDER, "in symbolData for symbol:" + symbol)

            if (Object.keys(this.stockData).indexOf(symbol) < 0) {
                this.callApi_get_cash_flow(symbol, (data) => {


                    let jsonObject = data;
                    if (typeof jsonObject !== "object")
                        jsonObject = JSON.parse(data);

                    const pickedData = yahooDataPicker.buildSymbolStats(jsonObject);
                    const prettyPickedData = this.pretty(pickedData, htmlStyled);
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
        const stocks = Object.keys(data)
        return stocks.map(s => this.pretty(this.stockData[s], true))
    }

    pretty(data, htmlStyled) {
        const valuesNeedConversionToPercentage = [consts.stockParams.FCS_earningsAvg, consts.stockParams.FCS_CAP]
        const bold = (s) => "<b>" + s + "</b>";
        const underline = (s) => "<u>" + s + "</u>";
        const italic = (s) => "<i>" + s + "</i>";
        const link = (url, str) => "<a href='" + url + "'>" + str + "</a>";



        let keyValue = data.map(({ key, value }) => {


            if (valuesNeedConversionToPercentage.indexOf(key) > -1)
                return `${htmlStyled ? underline(bold(key)) : key} : ${numberToPercentage(value)}%`

            else if (key === consts.stockParams.link)
                return `${htmlStyled ? link(value, key) : key + ": " + value}`

            return `${htmlStyled ? underline(bold(key)) : key}: ${value} `

        })

        return keyValue.join("\n\n")

    }




}