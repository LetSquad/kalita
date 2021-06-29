import { app, dialog } from "@electron/remote";
import React, { useCallback, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { Button } from "semantic-ui-react";
import { BrokerReportData } from "../../../../../models/table/types";
import { useAppDispatch } from "../../../../../store/hooks";
import { addBrokerAccountPositions } from "../../../../../store/table/tableReducer";
import { parseVtbReport } from "../../../../../utils/report/vtbBrokerReportUtils";
import BrokerReportLoaderWorker from "../../../../../workers/BrokerReportLoader.worker";
import styles from "./styles/BrokerAccountReportParser.scss";

export default function BrokerAccountReportParser() {
    const dispatch = useAppDispatch();
    const { addToast } = useToasts();

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

    const loadBrokerReport = useCallback(() => {
        if (chosenReportPath !== undefined) {
            setReportLoading(true);

            const reportLoader = new BrokerReportLoaderWorker();
            reportLoader.postMessage(chosenReportPath);

            reportLoader.addEventListener("message", (e: MessageEvent) => {
                try {
                    const reportData: BrokerReportData = parseVtbReport(e.data);
                    dispatch(addBrokerAccountPositions(reportData));
                } catch {
                    addToast("Произошла ошибка при парсинге отчета", { appearance: "error" });
                } finally {
                    setReportLoading(false);
                    setChosenReportPath(undefined);
                }
            });
        }
    }, [chosenReportPath, dispatch, addToast]);

    return (
        <>
            <div className={styles.chooseReportBlock}>
                <Button secondary basic size="mini" onClick={chooseBrokerReport}>Выберите файл</Button>
                <span className={styles.chosenReportPath}>
                    {chosenReportPath === undefined ? "Файл не выбран" : chosenReportPath}
                </span>
            </div>
            <Button primary disabled={chosenReportPath === undefined || isReportLoading} onClick={loadBrokerReport}>
                {isReportLoading ? "Загрузка..." : "Загрузить"}
            </Button>
        </>
    );
}
