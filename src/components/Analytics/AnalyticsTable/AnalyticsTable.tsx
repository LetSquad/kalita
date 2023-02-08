import {
    useCallback,
    useMemo,
    useRef,
    useState
} from "react";

import { AnalyticsTableData } from "../../../models/analytics/types";
import { MODEL_PORTFOLIOS } from "../../../models/constants";
import { ModelPortfolioMenuGroup } from "../../../models/menu/types";
import { Currency } from "../../../models/portfolios/enums";
import { BrokerAccount, ModelPortfolio } from "../../../models/portfolios/types";
import { useAppSelector } from "../../../store/hooks";
import Chart from "../../Chart/Chart";
import DataTable from "../../DataTable/DataTable";
import { DataTableRef } from "../../DataTable/types/base";
import { WithSuspense } from "../../utils/WithSuspense";
import { AdditionalHeader } from "../AdditionalHeader/AdditionalHeader";
import styles from "../styles/styles.scss";
import { getPortfoliosChartData } from "../utils/getPortfoliosChartData";
import { analyticsColumns } from "./columns";

export default function AnalyticsTable() {
    const [isChartMode, setIsChartMode] = useState<boolean>(false);
    const analyticsTableRef = useRef<DataTableRef>(null);

    const modelPortfolioNames: ModelPortfolioMenuGroup = useAppSelector((state) => (
        state.sidebarMenu.modelPortfolios
    ));
    const modelPortfolios: ModelPortfolio[] = useAppSelector((state) => (
        state.portfolios.modelPortfolios
    ));

    const brokerAccounts: BrokerAccount[] = useAppSelector((state) => (
        state.portfolios.brokerAccounts
    ));

    const chart = useMemo(() => (
        <div className={styles.chartContainer}>
            <div className={styles.chart}>
                <h2>Модельные портфели</h2>
                <Chart data={getPortfoliosChartData(modelPortfolios)} />
            </div>
            <div className={styles.chart}>
                <h2>Брокерские счета</h2>
                <Chart data={getPortfoliosChartData(brokerAccounts)} />
            </div>
        </div>
    ), [modelPortfolios, brokerAccounts]);

    const tableData: AnalyticsTableData[] = useMemo(() => {
        const totalAmount: number = modelPortfolios.flatMap(
            (p) =>
                (p.settings.baseCurrency === Currency.RUB ? p.positions.map((pos) => pos.amount) : [])
        ).reduce((acc, a) => acc + a, 0);

        return modelPortfolioNames.elements.flatMap((pn) => {
            const portfolio = modelPortfolios.find((p) => p.id === pn.id);
            if (!portfolio || portfolio.settings.baseCurrency !== Currency.RUB) return [];

            const portfolioAmount: number = portfolio.positions.map((pos) => pos.amount)
                .reduce((acc, a) => acc + a, 0);
            const proportion: number = portfolioAmount / totalAmount;

            return {
                id: portfolio.id,
                portfolio: pn.name,
                percentage: proportion * 100,
                amount: portfolioAmount,
                groupName: MODEL_PORTFOLIOS
            };
        });
    }, [modelPortfolioNames, modelPortfolios]);

    const table = useMemo(() => (
        <WithSuspense>
            <DataTable
                columns={analyticsColumns()}
                data={tableData}
                groupBy="groupName"
                expandableGroup
                classes={{
                    tableClassName: styles.table,
                    headerRowClassName: styles.headerRow,
                    groupRowClassName: styles.specificRow,
                    calcRowClassName: styles.specificRow,
                    rowClassName: styles.baseRow,
                    rowCellClassName: styles.baseCell,
                    calcRowCellClassName: styles.specificCell,
                    groupRowCellClassName: styles.specificCell
                }}
                ref={analyticsTableRef}
            />
        </WithSuspense>
    ), [tableData]);

    const handleToggleChartMode = useCallback(() => {
        setIsChartMode((old) => !old);
    }, [setIsChartMode]);

    return (
        <div className={styles.container}>
            <AdditionalHeader
                isChartMode={isChartMode}
                onToggleChartMode={handleToggleChartMode}
            />
            {
                isChartMode
                    ? chart
                    : table
            }
        </div>
    );
}
