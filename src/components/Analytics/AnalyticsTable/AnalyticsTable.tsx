import { useMemo, useRef } from "react";

import { AnalyticsTableData } from "../../../models/analytics/types";
import { MODEL_PORTFOLIOS } from "../../../models/constants";
import { ModelPortfolioMenuGroup } from "../../../models/menu/types";
import { Currency } from "../../../models/portfolios/enums";
import { ModelPortfolio } from "../../../models/portfolios/types";
import DataTable from "../../DataTable/DataTable";
import { DataTableRef } from "../../DataTable/types/base";
import { WithSuspense } from "../../utils/WithSuspense";
import { analyticsColumns } from "./columns";
import styles from "./styles/AnalyticsTable.scss";

interface Props {
    modelPortfolioNames: ModelPortfolioMenuGroup
    modelPortfolios: ModelPortfolio[]
}

export default function AnalyticsTable({ modelPortfolioNames, modelPortfolios }: Props) {
    const analyticsTableRef = useRef<DataTableRef>(null);

    const tableData: AnalyticsTableData[] = useMemo(() => {
        const totalAmount: number = modelPortfolios.flatMap(
            (p) => (p.settings.baseCurrency === Currency.RUB ? p.positions.map((pos) => pos.amount) : [])
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
