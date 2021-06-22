import React, { lazy } from "react";
import kalitaImages from "../../static/images/kalita.png";
import { useAppSelector } from "../../store/hooks";
import { WithSuspense } from "../utils/WithSuspense";
import styles from "./styles/DashboardContent.scss";

const Table = lazy(/* webpackChunkName: "model-portfolio-table" */() =>
    import("../BrokeragePortfolioTable/TableWrapper"));

export default function DashboardContent() {
    const tableState = useAppSelector((state) => state.tableData);

    if (tableState.isSettingsOpened) {
        return (
            <div>Sunny India will provide settings soon...</div>
        );
    }
    if (tableState.currentPortfolio) {
        return (
            <WithSuspense>
                <div className={styles.content}>
                    <Table currentPortfolio={tableState.currentPortfolio} />
                </div>
            </WithSuspense>
        );
    }
    return (
        <div className={styles.content}>
            <img src={kalitaImages} alt="Kalita" className={styles.contentImage} />
            <span className={styles.contentTitle}>KALITA</span>
            <div className={styles.separator} />
            <span className={styles.contentText}>Светлое инвестиционное будущее</span>
        </div>
    );
}
