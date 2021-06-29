import { app, dialog } from "@electron/remote";
import React, { useCallback, useMemo, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { Button, Dropdown } from "semantic-ui-react";
import { BrokerReportData, BrokerReportMetadata } from "../../../../../models/table/types";
import { useAppDispatch } from "../../../../../store/hooks";
import { addBrokerAccountPositions } from "../../../../../store/table/tableReducer";
import BrokerReportLoaderWorker from "../../../../../workers/BrokerReportLoader.worker";
import styles from "./styles/BrokerAccountReportParser.scss";
import { parseOpenBrokerReport } from "../../../../../utils/report/openBrokerReoprtUtils";
import { BrokerReportFormat } from "../../../../../models/table/enums";
import { parseVtbReport } from "../../../../../utils/report/vtbBrokerReportUtils";

const brokers: BrokerReportMetadata[] = [
    { brokerName: "ВТБ Брокер", reportFormat: BrokerReportFormat.XML_UTF8, reportParser: parseVtbReport },
    { brokerName: "Открытие Брокер", reportFormat: BrokerReportFormat.XML_WIN1251, reportParser: parseOpenBrokerReport }
];

export default function BrokerAccountReportParser() {
    const dispatch = useAppDispatch();
    const { addToast } = useToasts();

    const [chosenBrokerIndex, setChosenBrokerIndex] = useState<number>();
    const [chosenReportPath, setChosenReportPath] = useState<string>();
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

    const brokersOptions = useMemo(() => brokers.map((b, i) => ({ key: i, value: i, text: b.brokerName })), []);

    const loadBrokerReport = useCallback(() => {
        if (chosenBrokerIndex === undefined || chosenReportPath === undefined) return;
        const chosenBroker = brokers[chosenBrokerIndex];

        setReportLoading(true);

        const reportLoader = new BrokerReportLoaderWorker();
        reportLoader.postMessage({ path: chosenReportPath, format: chosenBroker.reportFormat });

        reportLoader.addEventListener("message", (e: MessageEvent) => {
            try {
                const reportData: BrokerReportData = chosenBroker.reportParser(chosenBroker.brokerName, e.data);
                dispatch(addBrokerAccountPositions(reportData));
            } catch {
                addToast("Произошла ошибка при загрузке отчета", { appearance: "error" });
            } finally {
                setChosenBrokerIndex(undefined);
                setChosenReportPath(undefined);
                setReportLoading(false);
                reportLoader.terminate();
            }
        });
    }, [chosenBrokerIndex, chosenReportPath, dispatch, addToast]);

    return (
        <>
            <div className={styles.chooseReportBlock}>
                <Dropdown
                    fluid
                    selection
                    className={styles.chosenReportBroker}
                    placeholder="Выберите брокера"
                    onChange={(_, { value }) => setChosenBrokerIndex(value as number)}
                    options={brokersOptions}
                />
                <Button secondary basic size="mini" disabled={chosenBrokerIndex === undefined} onClick={chooseBrokerReport}>
                    Выберите файл
                </Button>
                <span className={styles.chosenReportPath}>
                    {chosenReportPath === undefined ? "Файл не выбран" : chosenReportPath}
                </span>
            </div>
            <Button
                primary
                disabled={chosenBrokerIndex === undefined || chosenReportPath === undefined || isReportLoading}
                onClick={loadBrokerReport}
            >
                {isReportLoading ? "Загрузка..." : "Загрузить"}
            </Button>
        </>
    );
}
