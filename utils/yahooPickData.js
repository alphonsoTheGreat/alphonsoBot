const logger = require("./logger")
const PLACE_HOLDER = "yahooPickData.js"
const rowValueMap = {
    beta: "Beta rate",
    FCS_CAP: "free cash flow / cap",
    FCS_earningsAvg: "earnings/free cash flow",
    PE: "PE",
    market_cap: "market_cap",
    revenue_1Q2020: 4,
    earnings_1Q2020: 5,
    calc_1Q2020: 6,
    revenue_2Q2020: 7,
    earnings_2Q2020: 8,
    calc_2Q2020: 9,
    revenue_3Q2020: 10,
    earnings_3Q2020: 11,
    calc_3Q2020: 12,
    revenue_4Q2020: 13,
    earnings_4Q2020: 14,
    calc_4Q2020: 15,
    price: "price",
    free_cash_flow: "free_cash_flow"
}


const numberToPercentage = (number, afterDot = 2) => (number * 100).toFixed(afterDot)
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
            logger.INFO(PLACE_HOLDER, JSON.stringify({ earnings }))
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


    return ([
        ...earningsReduced,
        { key: rowValueMap.beta, value: beta },
        { key: rowValueMap.PE, value: PE },
        { key: rowValueMap.market_cap, value: marketCap },
        { key: rowValueMap.price, value: price },
        { key: rowValueMap.free_cash_flow, value: freeCashFlow },
        { key: rowValueMap.FCS_CAP, value: FCS_CAP_value },
        { key: rowValueMap.FCS_earningsAvg, value: FCS_earningsAvg_value },
    ])


}

module.exports = {
    buildSymbolStats,
    rowValueMap
}