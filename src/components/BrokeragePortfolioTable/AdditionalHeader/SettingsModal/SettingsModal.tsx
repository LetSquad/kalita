import {
    lazy,
    useCallback,
    useMemo,
    useState
} from "react";

import { Modal, Tab } from "semantic-ui-react";

import { BrokeragePortfolioTypes } from "../../../../models/portfolios/enums";
import { ModelPortfolio, Portfolio } from "../../../../models/portfolios/types";
import partsStyles from "../../../../styles/parts.scss";
import { WithSuspense } from "../../../utils/WithSuspense";
import styles from "./styles/SettingsModal.scss";

interface SettingsModalProps {
    currentPortfolio: Portfolio,
    readonly onClose: () => void;
    readonly activeTab: number;
}

const BrokerAccountReportParser = lazy(/* webpackChunkName: "brokerAccountReportParser" */() =>
    import("./BrokerAccountTabs/BrokerAccountReportParser"));
const ModelPortfolioQuantityModeSelector = lazy(/* webpackChunkName: "modelPortfolioQuantityModeSelector" */() =>
    import("./ModelPortfolioTabs/ModelPortfolioDataSourcesSelector"));
const CommonSettings = lazy(/* webpackChunkName: "commonSettings" */() =>
    import("./CommonTabs/CommonSettings"));

export default function SettingsModal({ currentPortfolio, onClose, activeTab }: SettingsModalProps) {
    const [activeIndex, setActiveIndex] = useState<number>(activeTab);

    const commonPanes = useMemo(() => [
        {
            menuItem: "Общие настройки",
            render: () => (
                <Tab.Pane className={styles.settingsTabPane}>
                    <CommonSettings />
                </Tab.Pane>
            )
        }
    ], []);

    const modelPortfolioPanes = useCallback((_currentPortfolio: ModelPortfolio) => [
        ...commonPanes,
        {
            menuItem: "Источники данных",
            render: () => (
                <Tab.Pane className={styles.settingsTabPane}>
                    <ModelPortfolioQuantityModeSelector currentPortfolio={_currentPortfolio} />
                </Tab.Pane>
            )
        }
    ], [commonPanes]);

    const brokerAccountPanes = useMemo(() => [
        ...commonPanes,
        {
            menuItem: "Загрузка отчёта брокера",
            render: () => (
                <Tab.Pane className={styles.settingsTabPane}>
                    <BrokerAccountReportParser />
                </Tab.Pane>
            )
        }
    ], [commonPanes]);

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
            <Modal.Header className={partsStyles.modalHeader}>Параметры брокерского счёта</Modal.Header>
            <Modal.Content className={partsStyles.modalContent}>
                <WithSuspense>
                    <Tab
                        menu={{ fluid: true, vertical: true, tabular: true }}
                        panes={settingsPanes}
                        activeIndex={activeIndex}
                        onTabChange={(event, data) => setActiveIndex(data.activeIndex as number)}
                    />
                </WithSuspense>
            </Modal.Content>
        </Modal>
    );
}
