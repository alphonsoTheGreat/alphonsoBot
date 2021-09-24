const logger = require("./logger")
const { numberToPercentage } = require("./helpers")
const { consts } = require(".")
// const urls = require("./urls")

const PLACE_HOLDER = "yahooPickData.js"


const earningsDateTrim = (dateString) => dateString.slice(0, 2) + dateString.slice(4, dateString.length)

const extractPE = (response) => {
    try {

        if (response.summaryDetail.trailingPE)
            return response.summaryDetail.trailingPE.raw
        else return "n/a"
    } catch (e) {
        logger.ERROR(PLACE_HOLDER, e)
        return "n/a"
    }
}
const extractBeta = (response) => {
    try {

        if (response.summaryDetail.beta)
            return response.summaryDetail.beta.fmt
        else return "n/a"
    } catch (e) {
        logger.ERROR(PLACE_HOLDER, e)
        return "n/a"
    }
}

const createYahooSymbolLink = (response) => `${consts.urls.yahooSymbolUrl}${response.quoteType.symbol}`


const extractMarketCap = (response, formatted = true) => {
    try {
        if (response.summaryDetail.marketCap)
            if (formatted)
                return response.summaryDetail.marketCap.fmt
            else return response.summaryDetail.marketCap.raw
        else return "cannot find"
    } catch (e) {
        logger.ERROR(PLACE_HOLDER, e)

        return "n/a"
    }
}


const extractCurrentPrice = (response) => {
    try {
        if (response.price.regularMarketPrice)
            return response.price.regularMarketPrice.raw
        else return "cannot find"
    } catch (e) {
        logger.ERROR(PLACE_HOLDER, e)

        return "n/a"
    }
}


const extractFreeCashFlow = (response, formatted = true) => {
    try {
        if (response.timeSeries)
            if (formatted)
                return response.timeSeries.trailingFreeCashFlow[0].reportedValue.fmt
            else
                return response.timeSeries.trailingFreeCashFlow[0].reportedValue.raw
        else return "cannot find"
    } catch (e) {
        logger.ERROR(PLACE_HOLDER, e)

        return "n/a"
    }
}


const extractEarnings = (responseS) => {
    try {
        if (responseS === undefined) return

        const earnings = responseS.earnings;
        if (earnings) {
            // logger.INFO(PLACE_HOLDER, JSON.stringify({ earnings }))
            const calc = earnings.financialsChart.quarterly.reduce((prev, q) => {
                return ({
                    ...prev,
                    [q.date]: {
                        date: q.date,
                        earnings: q.earnings.fmt.toString(),
                        revenue: q.revenue.fmt.toString(),
                        calc: ((q.earnings.raw / q.revenue.raw))
                    }
                })
            }, {})

            return calc
        }
        else return {}
    } catch (e) {
        logger.ERROR(PLACE_HOLDER, e)

        return "n/a"
    }

}

const reduceEarningObject = (earnings) => {
    try {
        const earningsKeys = Object.keys(earnings);

        return earningsKeys.reduce((prev, current) => {

            const Q_data = earnings[current];

            prev.push({
                key: earningsDateTrim(Q_data.date) + " :: rev/ear/calc", value: `${Q_data.revenue}/${Q_data.earnings}/${numberToPercentage(Q_data.calc)}%`
            })

            // prev.push({ key: "revenue_" + Q_data.date, value: Q_data.revenue })
            // prev.push({ key: "earnings_" + Q_data.date, value: Q_data.earnings })
            // prev.push({ key: "calc_" + Q_data.date, value: Q_data.calc })
            return prev
        }, [])
    } catch (e) {
        logger.ERROR(PLACE_HOLDER, e)

        return "n/a"
    }
}

const calculateFreeCashFlowOutOfMarketCap = (freeCashFlow, marketCap) => {
    try {
        return (freeCashFlow / marketCap)
    } catch (e) {
        logger.ERROR(PLACE_HOLDER, e)

        return "n/a"
    }
}

const calculateEarnigsAveregOutOfFreeCashFlow = (freeCashFlow, response) => {
    try {
        const earnings = response.earnings;
        if (earnings) {
            const calc = earnings.financialsChart.quarterly.reduce((prev, q) => {
                return ({
                    avarage: ((prev.avarage + q.earnings.raw) / (prev.total + 1)),
                    total: prev.total + 1,
                    accum: prev.avarage + q.earnings.raw
                })
            }, { avarage: 0, total: 0 })
            return (calc.avarage / freeCashFlow)

        }



        const earningsAvg = earnings;


    } catch (e) {
        logger.ERROR(PLACE_HOLDER, e)

        return "n/a"
    }
}


const buildSymbolStats = (symbolData) => {
    // logger.INFO(PLACE_HOLDER, JSON.stringify(symbolData))
    // logger.INFO(PLACE_HOLDER, symbolData)


    const PE = extractPE(symbolData);

    const earningsCalc = extractEarnings(symbolData);

    const marketCap = extractMarketCap(symbolData);

    const freeCashFlow = extractFreeCashFlow(symbolData);

    const price = extractCurrentPrice(symbolData);

    const beta = extractBeta(symbolData);

    const earningsReduced = reduceEarningObject(earningsCalc)

    const FCS_CAP_value = calculateFreeCashFlowOutOfMarketCap(extractFreeCashFlow(symbolData, false), extractMarketCap(symbolData, false));

    const FCS_earningsAvg_value = calculateEarnigsAveregOutOfFreeCashFlow(extractFreeCashFlow(symbolData, false), symbolData);

    const link = createYahooSymbolLink(symbolData);



    return ([
        ...earningsReduced,
        { key: consts.stockParams.beta, value: beta },
        { key: consts.stockParams.PE, value: PE },
        { key: consts.stockParams.market_cap, value: marketCap },
        { key: consts.stockParams.price, value: price },
        { key: consts.stockParams.free_cash_flow, value: freeCashFlow },
        { key: consts.stockParams.FCS_CAP, value: FCS_CAP_value },
        { key: consts.stockParams.FCS_earningsAvg, value: FCS_earningsAvg_value },
        { key: consts.stockParams.link, value: link }
    ])


}

module.exports = {
    buildSymbolStats
}