import { Modal, Tab } from "semantic-ui-react";
import React, { lazy, useMemo, useState } from "react";
import { WithSuspense } from "../../../utils/WithSuspense";
import styles from "./styles/SettingsModal.scss";
import { BrokeragePortfolioTypes } from "../../../../models/portfolios/enums";
import ModelPortfolioQuantityModeSelector from "./ModelPortfolioTabs/ModelPortfolioQuantityModeSelector";

interface Props {
    currentPortfolioType: BrokeragePortfolioTypes,
    readonly onClose: () => void;
    readonly activeTab: number;
}

const BrokerAccountReportParser = lazy(/* webpackChunkName: "brokerAccountReportParser" */() =>
    import("./BrokerAccountTabs/BrokerAccountReportParser"));

export default function SettingsModal({ currentPortfolioType, onClose, activeTab }: Props) {
    const [activeIndex, setActiveIndex] = useState<number>(activeTab);

    const settingsPanes = useMemo(() => (currentPortfolioType === BrokeragePortfolioTypes.MODEL_PORTFOLIO ? [
        {
            menuItem: "Источники данных",
            render: () => (
                <>
                    <Tab.Pane className={styles.settingsTabPane}>
                        <ModelPortfolioQuantityModeSelector />
                    </Tab.Pane>
                </>
            )
        }
    ] : [
        {
            menuItem: "Загрузка отчёта брокера",
            render: () => (
                <Tab.Pane className={styles.settingsTabPane}>
                    <BrokerAccountReportParser />
                </Tab.Pane>
            )
        }
    ]), [currentPortfolioType]);

    return (
        <Modal
            closeIcon
            onClose={onClose}
            open
        >
            <Modal.Header className={styles.modalHeader}>Параметры брокерского счёта</Modal.Header>
            <Modal.Content className={styles.modalContent}>
                <WithSuspense>
                    <Tab
                        menu={{ fluid: true, vertical: true, tabular: true }} panes={settingsPanes} activeIndex={activeIndex}
                        onTabChange={(event, data) => setActiveIndex(data.activeIndex as number)}
                    />
                </WithSuspense>
            </Modal.Content>
        </Modal>
    );
}
