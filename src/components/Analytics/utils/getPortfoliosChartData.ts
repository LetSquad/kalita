import { ChartData } from "chart.js/auto";

import { BrokerAccount, ModelPortfolio } from "../../../models/portfolios/types";

export function getPortfoliosChartData(portfolios: ModelPortfolio[] | BrokerAccount[]): ChartData<"doughnut"> {
    const amountMap = new Map<string, number>();
    let totalAmount = 0;
    for (const portfolio of portfolios) {
        for (const position of portfolio.positions) {
            const key: string = position.name ? position.name : position.ticker;
            const tickerAmount: number = (amountMap.get(key) || 0) + position.amount;
            amountMap.set(key, tickerAmount);
            totalAmount += position.amount;
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
