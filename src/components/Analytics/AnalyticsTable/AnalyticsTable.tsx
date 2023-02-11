import { useMemo, useRef } from "react";

import { AnalyticsTableData } from "../../../models/analytics/types";
import { MODEL_PORTFOLIOS } from "../../../models/constants";
import { ModelPortfolioMenuGroup } from "../../../models/menu/types";
import { Currency } from "../../../models/portfolios/enums";
import { BrokerAccount, ModelPortfolio } from "../../../models/portfolios/types";
import DataTable from "../../DataTable/DataTable";
import { DataTableRef } from "../../DataTable/types/base";
import { WithSuspense } from "../../utils/WithSuspense";
import { analyticsColumns } from "./columns";
import styles from "./styles/AnalyticsTable.scss";

interface Props {
    modelPortfolioNames: ModelPortfolioMenuGroup
    modelPortfolios: ModelPortfolio[]
    brokerAccounts: BrokerAccount[]
}

export default function AnalyticsTable({ modelPortfolioNames, modelPortfolios, brokerAccounts }: Props) {
    const analyticsTableRef = useRef<DataTableRef>(null);

    const tableData: AnalyticsTableData[] = useMemo(() => {
        const modelPortfolioPositions = new Set<string>();
        let totalAmount = 0;
        for (const portfolio of modelPortfolios) {
            for (const position of portfolio.positions) {
                modelPortfolioPositions.add(position.ticker);
                if (portfolio.settings.baseCurrency === Currency.RUB) {
                    totalAmount += position.amount;
                }
            }
        }

        const brokerAccountData: AnalyticsTableData[] = [];
        for (const account of brokerAccounts) {
            for (const position of account.positions) {
                if (!modelPortfolioPositions.has(position.ticker)) {
                    totalAmount += position.amount;
                }
            }
            for (const position of account.positions) {
                if (!modelPortfolioPositions.has(position.ticker)) {
                    const proportion: number = position.amount / totalAmount;
                    brokerAccountData.push({
                        id: position.id,
                        portfolio: position.name ?? position.ticker,
                        percentage: proportion * 100,
                        amount: position.amount,
                        groupName: "Неучтённые позиции"
                    });
                }
            }
        }

        const modelPortfolioData: AnalyticsTableData[] = [];
        for (const pn of modelPortfolioNames.elements) {
            const portfolio = modelPortfolios.find((p) => p.id === pn.id);
            if (portfolio && portfolio.settings.baseCurrency === Currency.RUB) {
                const portfolioAmount: number = portfolio.positions.map((pos) => pos.amount)
                    .reduce((acc, a) => acc + a, 0);
                const proportion: number = portfolioAmount / totalAmount;

                modelPortfolioData.push({
                    id: portfolio.id,
                    portfolio: pn.name,
                    percentage: proportion * 100,
                    amount: portfolioAmount,
                    groupName: MODEL_PORTFOLIOS
                });

                for (const position of portfolio.positions) {
                    modelPortfolioPositions.add(position.ticker);
                }
            }
        }

        return [...modelPortfolioData, ...brokerAccountData];
    }, [modelPortfolioNames, modelPortfolios, brokerAccounts]);

    return (
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
    );
}
