import { ChartData } from "chart.js/auto";

import { CurrencyQuotesMap } from "../../../models/apis/types";
import { Currency } from "../../../models/portfolios/enums";
import { BrokerAccount, ModelPortfolio } from "../../../models/portfolios/types";
import { getCurrencyQuote } from "../../../utils/currencyUtils";

export function getPortfoliosChartData(
    analyticsCurrency: Currency,
    currencyQuotes: CurrencyQuotesMap,
    portfolios: ModelPortfolio[] | BrokerAccount[]
): ChartData<"doughnut"> {
    const amountMap = new Map<string, number>();
    let totalAmount = 0;
    for (const portfolio of portfolios) {
        for (const position of portfolio.positions) {
            const currencyQuote = getCurrencyQuote(portfolio.settings.baseCurrency, analyticsCurrency, currencyQuotes);
            const positionAmount = (currencyQuote ? position.amount * currencyQuote : 0);

            if (positionAmount > 0) {
                const key: string = position.name ?? position.ticker;
                const tickerAmount: number = (amountMap.get(key) || 0) + positionAmount;
                amountMap.set(key, tickerAmount);
                totalAmount += positionAmount;
            }
        }
    }

    const percentageNormalized: number[] = [...amountMap.values()]
        .map((amount) => (amount / totalAmount) * 100);

    return {
        labels: [...amountMap.keys()],
        datasets: [{
            data: percentageNormalized
        }]
    };
}
