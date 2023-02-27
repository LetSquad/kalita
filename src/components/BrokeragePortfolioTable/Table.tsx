import {
    FocusEvent,
    KeyboardEvent,
    lazy,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import { ChartData } from "chart.js/auto";
import { Icon, Popup } from "semantic-ui-react";
import { $enum } from "ts-enum-util";

import { loadMoexQuoteByTicker } from "../../apis/moexApi";
import { BrokeragePortfolioTypes } from "../../models/portfolios/enums";
import { Portfolio } from "../../models/portfolios/types";
import { InstrumentViewMode, ModelPortfolioPriceMode } from "../../models/settings/enums";
import { BaseColumnNames, EditableTableColumns } from "../../models/table/enums";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    addNewPosition,
    update,
    updateGroupName,
    updatePosition
} from "../../store/portfolios/portfoliosReducer";
import Chart from "../Chart/Chart";
import stylesChart from "../Chart/styles/Chart.scss";
import { DataTableData, DataTableRef } from "../DataTable/types/base";
import { ColumnDefinition } from "../DataTable/types/column";
import { WithSuspense } from "../utils/WithSuspense";
import { AdditionalHeader } from "./AdditionalHeader/AdditionalHeader";
import DividendsModal from "./DividendsModal";
import styles from "./styles/Table.scss";

interface TableProps {
    columns: (dividendsButton: (ticket: string) => JSX.Element) => ColumnDefinition[],
    currentPortfolio: Portfolio,
    additionalHeaderPart?: JSX.Element
}

const DataTable = lazy(/* webpackChunkName: "dataTable" */() =>
    import("../DataTable/DataTable"));

export default function Table({ columns, currentPortfolio, additionalHeaderPart }: TableProps) {
    const dispatch = useAppDispatch();

    const [isChartMode, setIsChartMode] = useState<boolean>(false);
    const [dividendsTicket, setDividendsTicket] = useState<string>();

    const dataTableRef = useRef<DataTableRef>(null);

    const instrumentViewMode = useAppSelector((state) => state.settings.instrumentViewMode);

    const importTableToCsvText = useCallback(() => dataTableRef.current?.exportToCsv({ includeGroup: true }), []);

    const addRowToGroup = useCallback((groupName: string) => {
        dispatch(addNewPosition(groupName));
    }, [dispatch]);

    const updateGroup = useCallback((oldGroupName: string, newGroupName: string) => {
        dispatch(updateGroupName({
            oldGroupName,
            newGroupName
        }));
    }, [dispatch]);

    const rowMoved = useCallback((rowId: string, oldOrder: number, newOrder: number, newGroupName?: string) => {
        dispatch(updatePosition({
            id: rowId,
            oldOrder,
            newOrder,
            newGroupName
        }));
    }, [dispatch]);

    const cellUpdated = useCallback((
        rowId: string,
        field: keyof DataTableData,
        event: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>,
        value: string | number | boolean | undefined
    ) => {
        dispatch(update({
            id: rowId,
            valueKey: $enum(EditableTableColumns)
                .asValueOrThrow(field as string),
            newValue: value as string
        }));
        if (field === BaseColumnNames.TICKER &&
            !(currentPortfolio.type === BrokeragePortfolioTypes.MODEL_PORTFOLIO &&
                currentPortfolio.settings.priceMode === ModelPortfolioPriceMode.MANUAL_INPUT)
        ) {
            dispatch(loadMoexQuoteByTicker(value as string));
        }
    }, [dispatch, currentPortfolio]);

    const chart = useMemo(() => {
        const chartData: ChartData<"doughnut"> | null = {
            labels: currentPortfolio.positions.map((row) => (
                instrumentViewMode === InstrumentViewMode.INSTRUMENT_NAME && row.name
                    ? row.name
                    : row.ticker
            )),
            datasets: [{
                data: currentPortfolio.positions.map((row) => row.percentage)
            }]
        };

        return (
            <div className={stylesChart.chartWrapper}>
                <div className={stylesChart.chart}>
                    <Chart data={chartData} />
                </div>
            </div>
        );
    }, [currentPortfolio.positions, instrumentViewMode]);

    const dividendsButton = useCallback((ticket: string) => (
        <Popup
            content="Дивиденды"
            trigger={(
                <Icon
                    name="suitcase"
                    link
                    onClick={() => setDividendsTicket(ticket)}
                />
            )}
            position="top center"
            size="tiny"
        />
    ), []);

    const table = useMemo(() => (
        <WithSuspense>
            <DataTable
                columns={columns(dividendsButton)}
                data={currentPortfolio.positions}
                groupBy="groupName"
                onAddRowToGroup={addRowToGroup}
                onGroupNameEdit={updateGroup}
                expandableGroup
                onRowMoved={rowMoved}
                onCellBlur={cellUpdated}
                onCellKeyEnter={cellUpdated}
                classes={{
                    tableClassName: styles.table,
                    headerRowClassName: styles.headerRow,
                    groupRowClassName: styles.specificRow,
                    calcRowClassName: styles.specificRow,
                    rowClassName: styles.baseRow,
                    rowCellClassName: styles.baseCell,
                    calcRowCellClassName: styles.specificCell,
                    groupRowCellClassName: styles.specificCell
                }}
                ref={dataTableRef}
            />
        </WithSuspense>
    ), [columns, dividendsButton, currentPortfolio.positions, addRowToGroup, updateGroup, rowMoved, cellUpdated]);

    const handleToggleChartMode = useCallback(() => {
        setIsChartMode((old) => !old);
    }, [setIsChartMode]);

    useEffect(() => {
        setIsChartMode(false);
    }, [currentPortfolio]);

    return (
        <div className={styles.container}>
            <AdditionalHeader
                additionalHeaderPart={additionalHeaderPart}
                importTableToCsvText={importTableToCsvText}
                currentPortfolio={currentPortfolio}
                isChartMode={isChartMode}
                onToggleChartMode={handleToggleChartMode}
            />
            {
                isChartMode
                    ? chart
                    : table
            }
            {dividendsTicket && (
                <DividendsModal
                    ticker={dividendsTicket}
                    onClose={() => setDividendsTicket(undefined)}
                />
            )}
        </div>
    );
}
