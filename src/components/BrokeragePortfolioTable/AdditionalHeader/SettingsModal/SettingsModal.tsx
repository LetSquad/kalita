import { Modal, Tab } from "semantic-ui-react";
import React, {
    lazy, useCallback, useMemo, useState
} from "react";
import { ModelPortfolio, Portfolio } from "../../../../models/portfolios/types";
import { WithSuspense } from "../../../utils/WithSuspense";
import styles from "./styles/SettingsModal.scss";
import { BrokeragePortfolioTypes } from "../../../../models/portfolios/enums";

interface SettingsModalProps {
    currentPortfolio: Portfolio,
    readonly onClose: () => void;
    readonly activeTab: number;
}

const BrokerAccountReportParser = lazy(/* webpackChunkName: "brokerAccountReportParser" */() =>
    import("./BrokerAccountTabs/BrokerAccountReportParser"));
const ModelPortfolioQuantityModeSelector = lazy(/* webpackChunkName: "modelPortfolioQuantityModeSelector" */() =>
    import("./ModelPortfolioTabs/ModelPortfolioQuantityModeSelector"));

export default function SettingsModal({ currentPortfolio, onClose, activeTab }: SettingsModalProps) {
    const [activeIndex, setActiveIndex] = useState<number>(activeTab);

    const modelPortfolioPanes = useCallback((_currentPortfolio: ModelPortfolio) => [
        {
            menuItem: "Источники данных",
            render: () => (
                <>
                    <Tab.Pane className={styles.settingsTabPane}>
                        <ModelPortfolioQuantityModeSelector currentPortfolio={_currentPortfolio} />
                    </Tab.Pane>
                </>
            )
        }
    ], []);

    const brokerAccountPanes = useMemo(() => [
        {
            menuItem: "Загрузка отчёта брокера",
            render: () => (
                <Tab.Pane className={styles.settingsTabPane}>
                    <BrokerAccountReportParser />
                </Tab.Pane>
            )
        }
    ], []);
    const settingsPanes = useMemo(
        () => (currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO
            ? modelPortfolioPanes(currentPortfolio)
            : brokerAccountPanes),
        [currentPortfolio, modelPortfolioPanes, brokerAccountPanes]
    );

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
