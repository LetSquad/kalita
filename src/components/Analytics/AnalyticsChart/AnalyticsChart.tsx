import { CurrencyQuotesMap } from "../../../models/apis/types";
import { Currency } from "../../../models/portfolios/enums";
import { BrokerAccount, ModelPortfolio } from "../../../models/portfolios/types";
import Chart from "../../Chart/Chart";
import { getPortfoliosChartData } from "../utils/getPortfoliosChartData";
import styles from "./styles/AnalyticsChart.scss";

interface Props {
    analyticsCurrency: Currency
    currencyQuotes: CurrencyQuotesMap
    modelPortfolios: ModelPortfolio[]
    brokerAccounts: BrokerAccount[]
}

export default function AnalyticsChart(
    {
        analyticsCurrency,
        currencyQuotes,
        modelPortfolios,
        brokerAccounts
    }: Props
) {
    return (
        <div className={styles.chartContainer}>
            <div className={styles.chart}>
                <h2>Модельные портфели</h2>
                <Chart data={getPortfoliosChartData(analyticsCurrency, currencyQuotes, modelPortfolios)} />
            </div>
            <div className={styles.chart}>
                <h2>Брокерские счета</h2>
                <Chart data={getPortfoliosChartData(analyticsCurrency, currencyQuotes, brokerAccounts)} />
            </div>
        </div>
    );
}