import { useMemo, useRef } from "react";

import { AnalyticsTableData } from "../../../models/analytics/types";
import { CurrencyQuotesMap } from "../../../models/apis/types";
import { MODEL_PORTFOLIOS } from "../../../models/constants";
import { ModelPortfolioMenuGroup } from "../../../models/menu/types";
import { Currency } from "../../../models/portfolios/enums";
import { BrokerAccount, ModelPortfolio } from "../../../models/portfolios/types";
import { getCurrencyQuote } from "../../../utils/currencyUtils";
import DataTable from "../../DataTable/DataTable";
import { DataTableRef } from "../../DataTable/types/base";
import { WithSuspense } from "../../utils/WithSuspense";
import { analyticsColumns } from "./columns";
import styles from "./styles/AnalyticsTable.scss";

interface Props {
    analyticsCurrency: Currency
    currencyQuotes: CurrencyQuotesMap
    modelPortfolioNames: ModelPortfolioMenuGroup
    modelPortfolios: ModelPortfolio[]
    brokerAccounts: BrokerAccount[]
}

export default function AnalyticsTable(
    {
        analyticsCurrency,
        currencyQuotes,
        modelPortfolioNames,
        modelPortfolios,
        brokerAccounts
    }: Props
) {
    const analyticsTableRef = useRef<DataTableRef>(null);

    const tableData: AnalyticsTableData[] = useMemo(() => {
        const modelPortfolioPositions = new Set<string>();
        let totalAmount = 0;
        for (const portfolio of modelPortfolios) {
            for (const position of portfolio.positions) {
                modelPortfolioPositions.add(position.ticker);
                const currencyQuote = getCurrencyQuote(portfolio.settings.baseCurrency, analyticsCurrency, currencyQuotes);
                totalAmount += (currencyQuote ? position.amount * currencyQuote : 0);
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
            if (portfolio) {
                const currencyQuote = getCurrencyQuote(portfolio.settings.baseCurrency, analyticsCurrency, currencyQuotes);
                const portfolioAmount: number = portfolio.positions
                    .map((pos) => (currencyQuote ? pos.amount * currencyQuote : 0))
                    .reduce((acc, a) => acc + a, 0);
                const proportion: number = portfolioAmount / totalAmount;

                if (portfolioAmount > 0) {
                    modelPortfolioData.push({
                        id: portfolio.id,
                        portfolio: pn.name,
                        percentage: proportion * 100,
                        amount: portfolioAmount,
                        groupName: MODEL_PORTFOLIOS
                    });
                }
            }
        }

        return [...modelPortfolioData, ...brokerAccountData];
    }, [modelPortfolios, brokerAccounts, modelPortfolioNames.elements, analyticsCurrency, currencyQuotes]);

    return (
        <WithSuspense>
            <DataTable
                columns={analyticsColumns(analyticsCurrency)}
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
