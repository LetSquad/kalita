import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import { toast } from "react-hot-toast";
import { Button, Dropdown } from "semantic-ui-react";

import { app, dialog } from "@electron/remote";

import {
    BrokerCode,
    BrokerReportEncoding,
    BrokerReportFormat,
    BrokerReportPositionCodeFormat
} from "../../../../models/portfolios/enums";
import { BrokerReportLoadResult, BrokerReportMetadata } from "../../../../models/portfolios/types";
import openBrokerIcon from "../../../../static/icons/open-broker.ico";
import tinkoffBrokerIcon from "../../../../static/icons/tinkoff-broker.png";
import vtbBrokerIcon from "../../../../static/icons/vtb-broker.png";
import { useAppDispatch } from "../../../../store/hooks";
import { addBrokerAccountPositions } from "../../../../store/portfolios/portfoliosReducer";
import BrokerReportLoaderWorker from "../../../../workers/BrokerReportLoader.worker";
import styles from "./styles/BrokerAccountReportParser.scss";

const brokers: BrokerReportMetadata[] = [
    {
        brokerName: "ВТБ Брокер",
        brokerCode: BrokerCode.VTB,
        icon: vtbBrokerIcon,
        reportFormat: BrokerReportFormat.XML,
        reportEncoding: BrokerReportEncoding.UTF8,
        positionCodeFormat: BrokerReportPositionCodeFormat.ISIN
    },
    {
        brokerName: "Открытие Брокер",
        brokerCode: BrokerCode.OPEN_BROKER,
        icon: openBrokerIcon,
        reportFormat: BrokerReportFormat.XML,
        reportEncoding: BrokerReportEncoding.WIN1251,
        positionCodeFormat: BrokerReportPositionCodeFormat.TICKER
    },
    {
        brokerName: "Тинькофф Инвестиции",
        brokerCode: BrokerCode.TINKOFF,
        icon: tinkoffBrokerIcon,
        reportFormat: BrokerReportFormat.XLSX,
        reportEncoding: BrokerReportEncoding.UTF8,
        positionCodeFormat: BrokerReportPositionCodeFormat.TICKER
    }
];

const LOAD_BROKER_ACCOUNT_TOAST_ID = "load-broker-account";

export default function BrokerAccountReportParser() {
    const dispatch = useAppDispatch();

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

    const brokersOptions = useMemo(() => brokers.map((b, i) => ({
        key: i,
        value: i,
        image: { src: b.icon, size: "mini" },
        text: b.brokerName
    })), []);

    const onBrokerReportLoaded = useCallback((event: MessageEvent<BrokerReportLoadResult>) => {
        if (event.data.error !== undefined) {
            console.error(event.data.error);

            toast.error("Произошла ошибка при загрузке отчёта", {
                id: LOAD_BROKER_ACCOUNT_TOAST_ID
            });
        } else if (
            chosenBrokerIndex !== undefined &&
            chosenReportPath !== undefined &&
            event.data.reportData !== undefined
        ) {
            dispatch(addBrokerAccountPositions(event.data.reportData));
            toast.success(`Отчёт ${event.data.reportData.accountName} успешно загружен`, {
                id: LOAD_BROKER_ACCOUNT_TOAST_ID
            });
        }

        setChosenReportPath(undefined);
        setReportLoading(false);
        if (reportLoader) {
            reportLoader.terminate();
            setReportLoader(undefined);
        }
    }, [dispatch, chosenBrokerIndex, chosenReportPath, reportLoader, setReportLoading]);

    const loadBrokerReport = useCallback(() => {
        if (chosenBrokerIndex === undefined || chosenReportPath === undefined) {
            return;
        }
        toast.loading("Загрузка отчёта", {
            id: LOAD_BROKER_ACCOUNT_TOAST_ID
        });

        const chosenBroker = brokers[chosenBrokerIndex];

        setReportLoading(true);

        const loader = new BrokerReportLoaderWorker();
        setReportLoader(loader);
        loader.postMessage({
            brokerName: chosenBroker.brokerName,
            brokerCode: chosenBroker.brokerCode,
            path: chosenReportPath,
            format: chosenBroker.reportFormat,
            encoding: chosenBroker.reportEncoding,
            positionCodeFormat: chosenBroker.positionCodeFormat
        });

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
                <Button
                    secondary
                    basic
                    size="mini"
                    disabled={chosenBrokerIndex === undefined}
                    onClick={chooseBrokerReport}
                >
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
