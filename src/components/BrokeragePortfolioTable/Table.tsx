import React, {
    FocusEvent,
    KeyboardEvent,
    lazy,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { $enum } from "ts-enum-util";
import { ChartData } from "chart.js/auto";
import { loadMoexQuoteByTicker } from "../../apis/moexApi";
import { Portfolio } from "../../models/portfolios/types";
import { BaseColumnNames, EditableTableColumns } from "../../models/table/enums";
import { useAppDispatch } from "../../store/hooks";
import { addNewPosition, update, updateGroupName, updatePosition } from "../../store/portfolios/portfoliosReducer";
import { DataTableData, DataTableRef } from "../DataTable/types/base";
import { ColumnDefinition } from "../DataTable/types/column";
import { WithSuspense } from "../utils/WithSuspense";
import { AdditionalHeader } from "./AdditionalHeader/AdditionalHeader";
import styles from "./styles/Table.scss";
import stylesChart from "../Chart/styles/Chart.scss";
import Chart from "../Chart/Chart";
import DividendsModal from "./DividendsModal";
import { Icon, Popup } from "semantic-ui-react";

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

    const importTableToCsvText = useCallback(() => dataTableRef.current?.exportToCsv({ includeGroup: true }), []);

    const addRowToGroup = useCallback((groupName) => {
        dispatch(addNewPosition(groupName));
    }, [dispatch]);

    const updateGroup = useCallback((oldGroupName, newGroupName) => {
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
        if (field === BaseColumnNames.TICKER) {
            dispatch(loadMoexQuoteByTicker(value as string));
        }
    }, [dispatch]);

    const chart = useMemo(() => {
        const chartData: ChartData | null = {
            labels: currentPortfolio.positions.map((row) => row.ticker),
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
    }, [currentPortfolio.positions]);

    const dividendsButton = useCallback((ticket: string) => (
        <Popup
            content="Дивиденды"
            trigger={<Icon name="suitcase" link onClick={() => setDividendsTicket(ticket)}/>}
            position='top center'
            size='tiny'
        />), []);

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
            {dividendsTicket && <DividendsModal ticket={dividendsTicket} onClose={() => setDividendsTicket(undefined)} />}
        </div>
    );
}
