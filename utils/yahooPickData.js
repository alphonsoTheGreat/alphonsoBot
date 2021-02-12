module.exports = {
    // ------------------------------------------------------------------------------------
    helpers: {





        buildSymbolStats: function (symbolData) {

            const foo = {
                extractPE: function (response) {
                    if (response.summaryDetail.trailingPE)
                        return response.summaryDetail.trailingPE.raw
                    else return "cannot find"
                },



                extractMarketCap: function (response, formatted = true) {
                    if (response.summaryDetail.marketCap)
                        if (formatted)
                            return response.summaryDetail.marketCap.fmt
                        else return response.summaryDetail.marketCap.raw
                    else return "cannot find"
                },


                extractCurrentPrice: function (response) {
                    if (response.price.regularMarketPrice)
                        return response.price.regularMarketPrice.raw
                    else return "cannot find"
                },


                extractFreeCashFlow: function (response, formatted = true) {
                    if (response.timeSeries)
                        if (formatted)
                            return response.timeSeries.trailingFreeCashFlow[0].reportedValue.fmt
                        else
                            return response.timeSeries.trailingFreeCashFlow[0].reportedValue.raw
                    else return "cannot find"
                },


                extractEarnings: function (responseS) {
                    if (responseS === undefined) return

                    const earnings = responseS.earnings;
                    if (earnings) {
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


                },
                reduceEarningObject: function (earnings) {

                    const earningsKeys = Object.keys(earnings);

                    return earningsKeys.reduce((prev, current) => {

                        const Q_data = earnings[current];
                        prev.push({ key: "revenue_" + Q_data.date, value: Q_data.revenue })
                        prev.push({ key: "earnings_" + Q_data.date, value: Q_data.earnings })
                        prev.push({ key: "calc_" + Q_data.date, value: Q_data.calc })
                        return prev
                    }, [])
                },

                calculateFreeCashFlowOutOfMarketCap: function (freeCashFlow, marketCap) {
                    return (freeCashFlow / marketCap)
                },

                calculateEarnigsAveregOutOfFreeCashFlow: function (freeCashFlow, response) {
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



                    const earningsAvg = earnings
                },


            }


            const PE = foo.extractPE(symbolData);

            const earningsCalc = foo.extractEarnings(symbolData);

            const marketCap = foo.extractMarketCap(symbolData);

            const freeCashFlow = foo.extractFreeCashFlow(symbolData);

            const price = foo.extractCurrentPrice(symbolData);

            const earningsReduced = foo.reduceEarningObject(earningsCalc)

            const FCS_CAP_value = foo.calculateFreeCashFlowOutOfMarketCap(extractFreeCashFlow(symbolData, false), extractMarketCap(symbolData, false));

            const FCS_earningsAvg_value = foo.calculateEarnigsAveregOutOfFreeCashFlow(extractFreeCashFlow(symbolData, false), symbolData);


            return ([
                ...earningsReduced,
                { key: helpers.consts.rowValueMap.PE, value: PE },
                { key: helpers.consts.rowValueMap.market_cap, value: marketCap },
                { key: helpers.consts.rowValueMap.price, value: price },
                { key: helpers.consts.rowValueMap.free_cash_flow, value: freeCashFlow },
                { key: helpers.consts.rowValueMap.FCS_CAP, value: FCS_CAP_value },
                { key: helpers.consts.rowValueMap.FCS_earningsAvg, value: FCS_earningsAvg_value },
            ])


        },

        consts: {

            rowValueMap: {
                FCS_CAP: "FCS_CAP",
                FCS_earningsAvg: "FCS_earningsAvg",
                PE: "PE",
                symbole: "symbole",
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
        }










    }

}