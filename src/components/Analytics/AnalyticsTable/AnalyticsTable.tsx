import { useMemo, useRef } from "react";

import { AnalyticsTableData } from "../../../models/analytics/types";
import { CurrencyQuotesMap } from "../../../models/apis/types";
import { MODEL_PORTFOLIOS } from "../../../models/constants";
import { ModelPortfolioMenuGroup } from "../../../models/menu/types";
import { Currency } from "../../../models/portfolios/enums";
import { BrokerAccount, ModelPortfolio } from "../../../models/portfolios/types";
import { InstrumentViewMode } from "../../../models/settings/enums";
import { useAppSelector } from "../../../store/hooks";
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

    const instrumentViewMode = useAppSelector((state) => state.settings.instrumentViewMode);

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

        const unaccountedPositions: AnalyticsTableData[] = [];
        for (const account of brokerAccounts) {
            for (const position of account.positions) {
                if (!modelPortfolioPositions.has(position.ticker)) {
                    totalAmount += position.amount;
                }
            }
            for (const position of account.positions) {
                if (!modelPortfolioPositions.has(position.ticker)) {
                    const proportion: number = position.amount / totalAmount;
                    unaccountedPositions.push({
                        id: position.id,
                        portfolio: instrumentViewMode === InstrumentViewMode.INSTRUMENT_NAME && position.name
                            ? position.name
                            : position.ticker,
                        percentage: proportion * 100,
                        amount: position.amount,
                        groupName: "Неучтённые позиции"
                    });
                }
            }
        }

        const groupedModelPortfolios: AnalyticsTableData[] = [];
        const ungroupedModelPortfolios: AnalyticsTableData[] = [];
        for (const portfolioName of modelPortfolioNames.elements) {
            const portfolio = modelPortfolios.find((p) => p.id === portfolioName.id);
            if (portfolio) {
                const currencyQuote = getCurrencyQuote(portfolio.settings.baseCurrency, analyticsCurrency, currencyQuotes);
                const portfolioAmount: number = portfolio.positions
                    .map((pos) => (currencyQuote ? pos.amount * currencyQuote : 0))
                    .reduce((acc, a) => acc + a, 0);
                const proportion: number = portfolioAmount / totalAmount;

                if (portfolioAmount > 0) {
                    const portfolioNameSegments: string[] = portfolioName.name.split("-");
                    if (portfolioNameSegments.length > 1) {
                        groupedModelPortfolios.push({
                            id: portfolio.id,
                            portfolio: portfolioName.name,
                            percentage: proportion * 100,
                            amount: portfolioAmount,
                            groupName: portfolioNameSegments[0]
                        });
                    } else {
                        ungroupedModelPortfolios.push({
                            id: portfolio.id,
                            portfolio: portfolioName.name,
                            percentage: proportion * 100,
                            amount: portfolioAmount,
                            groupName: MODEL_PORTFOLIOS
                        });
                    }
                }
            }
        }

        return [...groupedModelPortfolios, ...ungroupedModelPortfolios, ...unaccountedPositions];
    }, [modelPortfolios, analyticsCurrency, currencyQuotes, brokerAccounts, instrumentViewMode, modelPortfolioNames.elements]);

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
