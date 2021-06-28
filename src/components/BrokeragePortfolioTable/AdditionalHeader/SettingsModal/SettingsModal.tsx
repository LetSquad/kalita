import { Modal, Tab } from "semantic-ui-react";
import React, { lazy, useMemo, useState } from "react";
import { WithSuspense } from "../../../utils/WithSuspense";
import styles from "./styles/SettingsModal.scss";

interface Props {
    readonly onClose: () => void;
    readonly activeTab: number;
}

const BrokerAccountReportParser = lazy(/* webpackChunkName: "brokerAccountReportParser" */() =>
    import("./BrokerModalTabs/BrokerAccountReportParser"));

export default function SettingsModal({ onClose, activeTab }: Props) {
    const [activeIndex, setActiveIndex] = useState<number>(activeTab);

    const brokerPanes = useMemo(() => [
        {
            menuItem: "Загрузка отчёта брокера (ВТБ)",
            render: () => (
                <Tab.Pane className={styles.vtbReportTabPane}>
                    <BrokerAccountReportParser />
                </Tab.Pane>
            )
        }
    ], []);

    return (
        <Modal
            closeIcon
            onClose={onClose}
            open
        >
            <Modal.Header className={styles.modal}>Параметры брокерского счёта</Modal.Header>
            <Modal.Content className={styles.modal}>
                <WithSuspense>
                    <Tab
                        menu={{ fluid: true, vertical: true, tabular: true }} panes={brokerPanes} activeIndex={activeIndex}
                        onTabChange={(event, data) => setActiveIndex(data.activeIndex as number)}
                    />
                </WithSuspense>
            </Modal.Content>
        </Modal>
    );
}
