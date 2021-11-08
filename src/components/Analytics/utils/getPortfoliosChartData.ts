import { ChartData } from "chart.js/auto";
import { BrokerAccount, ModelPortfolio } from "../../../models/portfolios/types";

export function getPortfoliosChartData(portfolios: ModelPortfolio[] | BrokerAccount[]): ChartData<"doughnut"> {
    const percentageMap = new Map<string, number>();
    let percentageSum = 0;
    for (const portfolio of portfolios) {
        for (const position of portfolio.positions) {
            const tickerPercentageSum: number = (percentageMap.get(position.ticker) || 0) + position.percentage;
            percentageMap.set(position.ticker, tickerPercentageSum);
            percentageSum += position.percentage;
        }
    }

    const percentageNormalized: number[] = [...percentageMap.values()]
        .map((val) => ((val * 100) / percentageSum));

    return {
        labels: [...percentageMap.keys()],
        datasets: [{
            data: percentageNormalized
        }]
    };
}
