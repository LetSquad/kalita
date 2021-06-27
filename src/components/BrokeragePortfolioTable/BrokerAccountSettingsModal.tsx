import { Button, Header, Modal } from "semantic-ui-react";
import React, { useCallback, useState } from "react";
import { app, dialog } from "@electron/remote";
import BrokerReportLoaderWorker from "../../workers/BrokerReportLoader.worker";
import styles from "./styles/BrokerAccountSettingsModal.scss";
import { addBrokerAccountPositions } from "../../store/table/tableReducer";
import { useAppDispatch } from "../../store/hooks";
import { BrokerReportData } from "../../model/table/types";
import { parseVtbReport } from "../../utils/report/vtbBrokerReportUtils";

interface Props {
    readonly trigger: React.ReactNode
}

export default function BrokerAccountSettingsModal({ trigger }: Props) {
    const dispatch = useAppDispatch();
    const [isModalOpen, setModalOpen] = useState(false);
    const [chosenReportPath, setChosenReportPath] = useState<string | undefined>(undefined);
    const [isReportLoading, setReportLoading] = useState<boolean>(false);

    const chooseBrokerReport = useCallback(() => {
        const path = dialog.showOpenDialogSync({
            defaultPath: `${app.getPath("home")}`,
            title: "Выберите брокерский отчёт",
            filters: [
                { name: "xml", extensions: ["xml"] }
            ],
            properties: ["openFile"]
        })?.[0];

        if (path == null) {
            setChosenReportPath(undefined);
        } else {
            setChosenReportPath(path);
        }
    }, [setChosenReportPath]);

    const loadBrokerReport = useCallback(() => {
        if (chosenReportPath !== undefined) {
            setReportLoading(true);

            const reportLoader = new BrokerReportLoaderWorker();
            reportLoader.postMessage(chosenReportPath);

            reportLoader.addEventListener("message", (e: MessageEvent) => {
                const reportData: BrokerReportData = parseVtbReport(e.data);
                dispatch(addBrokerAccountPositions(reportData));

                setReportLoading(false);
                setChosenReportPath(undefined);
                setModalOpen(false);
            });
        }
    }, [dispatch, setReportLoading, chosenReportPath, setChosenReportPath, setModalOpen]);

    return (
        <Modal
            onClose={() => setModalOpen(false)}
            onOpen={() => setModalOpen(true)}
            open={isModalOpen}
            trigger={trigger}
        >
            <Modal.Header className={styles.modal}>Параметры брокерского счёта</Modal.Header>
            <Modal.Content className={styles.modal}>
                <Header>Загрузка отчёта брокера (ВТБ)</Header>
                <div className={styles.chooseReportBlock}>
                    <Button secondary basic size="mini" onClick={chooseBrokerReport}>Выберите файл</Button>
                    <span className={styles.chosenReportPath}>
                        {chosenReportPath === undefined ? "Файл не выбран" : chosenReportPath}
                    </span>
                </div>
                <Button primary disabled={chosenReportPath === undefined || isReportLoading} onClick={loadBrokerReport}>
                    {isReportLoading ? "Загрузка..." : "Загрузить"}
                </Button>
            </Modal.Content>
            <Modal.Actions className={styles.modal}>
                <Button secondary onClick={() => setModalOpen(false)}>Закрыть</Button>
            </Modal.Actions>
        </Modal>
    );
}
