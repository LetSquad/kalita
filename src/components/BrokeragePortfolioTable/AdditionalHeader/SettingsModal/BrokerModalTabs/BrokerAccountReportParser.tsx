import { app, dialog } from "@electron/remote";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useToasts } from "react-toast-notifications";
import { Button, Dropdown } from "semantic-ui-react";
import { BrokerReportData, BrokerReportMetadata } from "../../../../../models/table/types";
import { useAppDispatch } from "../../../../../store/hooks";
import { addBrokerAccountPositions } from "../../../../../store/table/tableReducer";
import BrokerReportLoaderWorker from "../../../../../workers/BrokerReportLoader.worker";
import styles from "./styles/BrokerAccountReportParser.scss";
import { parseOpenBrokerReport } from "../../../../../utils/report/openBrokerReoprtUtils";
import { BrokerReportEncoding, BrokerReportFormat } from "../../../../../models/table/enums";
import { parseVtbReport } from "../../../../../utils/report/vtbBrokerReportUtils";
import vtbBrokerIcon from "../../../../../static/icons/vtb-broker.png";
import openBrokerIcon from "../../../../../static/icons/open-broker.ico";
import tinkoffBrokerIcon from "../../../../../static/icons/tinkoff-broker.png";
import { parseTinkoffReport } from "../../../../../utils/report/tinkoffBrokerReportUtils";

const brokers: BrokerReportMetadata[] = [
    {
        brokerName: "ВТБ Брокер",
        icon: vtbBrokerIcon,
        reportFormat: BrokerReportFormat.XML,
        reportEncoding: BrokerReportEncoding.UTF8,
        reportParser: parseVtbReport
    },
    {
        brokerName: "Открытие Брокер",
        icon: openBrokerIcon,
        reportFormat: BrokerReportFormat.XML,
        reportEncoding: BrokerReportEncoding.WIN1251,
        reportParser: parseOpenBrokerReport
    },
    {
        brokerName: "Тинькофф Инвестиции",
        icon: tinkoffBrokerIcon,
        reportFormat: BrokerReportFormat.XLSX,
        reportEncoding: BrokerReportEncoding.UTF8,
        reportParser: parseTinkoffReport
    }
];

export default function BrokerAccountReportParser() {
    const dispatch = useAppDispatch();
    const { addToast } = useToasts();

    const [chosenBrokerIndex, setChosenBrokerIndex] = useState<number>();
    const [chosenReportPath, setChosenReportPath] = useState<string>();
    const [isReportLoading, setReportLoading] = useState<boolean>(false);
    const [reportLoader, setReportLoader] = useState<Worker>();

    const chooseBrokerReport = useCallback(() => {
        if (chosenBrokerIndex === undefined) {
            return;
        }

        const path = dialog.showOpenDialogSync({
            defaultPath: `${app.getPath("home")}`,
            title: "Выберите брокерский отчёт",
            filters: [
                { name: brokers[chosenBrokerIndex].reportFormat, extensions: [brokers[chosenBrokerIndex].reportFormat] }
            ],
            properties: ["openFile"]
        })?.[0];

        if (path == null) {
            setChosenReportPath(undefined);
        } else {
            setChosenReportPath(path);
        }
    }, [chosenBrokerIndex]);

    const brokersOptions = useMemo(() => brokers.map((b, i) => (
        {
            key: i,
            value: i,
            image: { src: b.icon, size: "mini" },
            text:
            b.brokerName
        })), []
    );

    const onBrokerReportLoaded = useCallback((e: MessageEvent) => {
        if (chosenBrokerIndex === undefined || chosenReportPath === undefined) {
            return;
        }
        const chosenBroker = brokers[chosenBrokerIndex];

        try {
            const reportData: BrokerReportData = chosenBroker.reportParser(chosenBroker.brokerName, e.data);
            dispatch(addBrokerAccountPositions(reportData));
            addToast(`Отчёт ${reportData.accountName} успешно загружен`, { appearance: "success" });
        } catch {
            addToast("Произошла ошибка при загрузке отчёта", { appearance: "error" });
        } finally {
            setChosenBrokerIndex(undefined);
            setChosenReportPath(undefined);
            setReportLoading(false);
            if (reportLoader) {
                reportLoader.terminate();
                setReportLoader(undefined);
            }
        }
    }, [dispatch, addToast, chosenBrokerIndex, chosenReportPath, reportLoader, setReportLoading]);

    const loadBrokerReport = useCallback(() => {
        if (chosenBrokerIndex === undefined || chosenReportPath === undefined) {
            return;
        }
        const chosenBroker = brokers[chosenBrokerIndex];

        setReportLoading(true);

        const loader = new BrokerReportLoaderWorker();
        setReportLoader(loader);
        loader.postMessage({ path: chosenReportPath, format: chosenBroker.reportFormat, encoding: chosenBroker.reportEncoding });

        loader.addEventListener("message", onBrokerReportLoaded);
    }, [chosenBrokerIndex, chosenReportPath, onBrokerReportLoaded]);

    useEffect(() => () => {
        if (reportLoader) {
            reportLoader.removeEventListener("message", onBrokerReportLoaded);
            reportLoader.terminate();
        }
    });

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
