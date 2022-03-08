import { BrokerAccount, ModelPortfolio } from "../../models/portfolios/types";
import { useAppSelector } from "../../store/hooks";
import Chart from "../Chart/Chart";
import styles from "./styles/styles.scss";
import { getPortfoliosChartData } from "./utils/getPortfoliosChartData";

export default function Analytics() {
    const modelPortfolios: ModelPortfolio[] = useAppSelector((state) => (
        state.portfolios.modelPortfolios
    ));
    const brokerAccounts: BrokerAccount[] = useAppSelector((state) => (
        state.portfolios.brokerAccounts
    ));

    return (
        <div className={styles.container}>
            <div className={styles.chart}>
                <h2>Модельные портфели</h2>
                <Chart data={getPortfoliosChartData(modelPortfolios)} />
            </div>
            <div className={styles.chart}>
                <h2>Брокерские счета</h2>
                <Chart data={getPortfoliosChartData(brokerAccounts)} />
            </div>
        </div>
    );
}
