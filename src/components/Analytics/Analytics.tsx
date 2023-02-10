import { useCallback, useMemo, useState } from "react";

import { ModelPortfolioMenuGroup } from "../../models/menu/types";
import { BrokerAccount, ModelPortfolio } from "../../models/portfolios/types";
import { useAppSelector } from "../../store/hooks";
import { AdditionalHeader } from "./AdditionalHeader/AdditionalHeader";
import AnalyticsChart from "./AnalyticsChart/AnalyticsChart";
import AnalyticsTable from "./AnalyticsTable/AnalyticsTable";
import styles from "./styles/Analytics.scss";

export default function Analytics() {
    const [isChartMode, setIsChartMode] = useState<boolean>(false);

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
        <AnalyticsChart
            modelPortfolios={modelPortfolios}
            brokerAccounts={brokerAccounts}
        />
    ), [modelPortfolios, brokerAccounts]);

    const table = useMemo(() => (
        <AnalyticsTable
            modelPortfolioNames={modelPortfolioNames}
            modelPortfolios={modelPortfolios}
        />
    ), [modelPortfolioNames, modelPortfolios]);

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
