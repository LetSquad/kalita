import { Button, Header, Modal } from "semantic-ui-react";
import React, { ChangeEvent, useState } from "react";
import BrokerReportLoaderWorker from "../../workers/BrokerReportLoader.worker";
import styles from "./styles/BrokerSettingsModal.scss";
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

    function onBrokerReportChosen(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files == null) {
            setChosenReportPath(undefined);
        } else {
            setChosenReportPath(e.target.files[0].path);
        }
    }

    function loadBrokerReport() {
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
    }

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
                <input type="file" accept="application/xml" onChange={onBrokerReportChosen} />
                <br />
                <br />
                <Button disabled={chosenReportPath === undefined || isReportLoading} onClick={loadBrokerReport}>
                    {isReportLoading ? "Загрузка..." : "Загрузить"}
                </Button>
            </Modal.Content>
            <Modal.Actions className={styles.modal}>
                <Button color="black" onClick={() => setModalOpen(false)}>Закрыть</Button>
            </Modal.Actions>
        </Modal>
    );
}
