import React, { lazy } from "react";
import { useAppSelector } from "../../store/hooks";
import { currentPortfolioSelector } from "../../store/portfolios/selectors";
import { Kalita } from "../Kalita/Kalita";
import { WithSuspense } from "../utils/WithSuspense";
import styles from "./styles/DashboardContent.scss";

const Table = lazy(/* webpackChunkName: "model-portfolio-table" */() =>
    import("../BrokeragePortfolioTable/TableWrapper"));

export default function DashboardContent() {
    const currentPortfolio = useAppSelector(currentPortfolioSelector);

    if (currentPortfolio) {
        return (
            <WithSuspense>
                <div className={styles.content}>
                    <Table currentPortfolio={currentPortfolio} />
                </div>
            </WithSuspense>
        );
    }
    return (
        <div className={styles.content}>
            <Kalita />
        </div>
    );
}
