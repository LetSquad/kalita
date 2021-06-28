import React, { lazy } from "react";
import { useAppSelector } from "../../store/hooks";
import { Kalita } from "../Kalita/Kalita";
import { WithSuspense } from "../utils/WithSuspense";
import styles from "./styles/DashboardContent.scss";

const Table = lazy(/* webpackChunkName: "model-portfolio-table" */() =>
    import("../BrokeragePortfolioTable/TableWrapper"));

export default function DashboardContent() {
    const currentPortfolio = useAppSelector((state) => state.tableData.currentPortfolio);

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
