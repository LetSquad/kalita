import _ from "lodash";
import React, {
    useCallback, useMemo, useRef, useState
} from "react";
import { ReactTabulator } from "react-tabulator";
import { Popup } from "semantic-ui-react";
import { $enum } from "ts-enum-util";
import { ColumnCalcsPosition, RowRange, TableLayout } from "../../../custom_typings/react-tabulator/enums";
import {
    CellComponent,
    ColumnDefinition,
    DataTypes,
    GroupComponent,
    RowComponent,
    TabulatorOptions,
    TabulatorRef,
    TabulatorTableDownloadConfig
} from "../../../custom_typings/react-tabulator/types";
import { getMoexQuotesForName } from "../../apis/moexApi";
import { Portfolio } from "../../models/portfolios/types";
import { BaseColumnNames, EditableTableColumns, ModelPortfolioColumnNames } from "../../models/table/enums";
import { TableData } from "../../models/table/types";
import { useAppDispatch } from "../../store/hooks";
import {
    addNewPosition,
    deleteRowById,
    update,
    updateGroupName
} from "../../store/portfolios/portfoliosReducer";
import { ActionBlock } from "./ActionBlock";
import { AdditionalHeader } from "./AdditionalHeader/AdditionalHeader";
import styles from "./styles/Table.scss";
import { generateCsv, generateExportList } from "./utils/utils";

interface TableProps {
    columns: (actionBlock: JSX.Element, setCurrentInvalidCell: (invalidCell?: [HTMLDivElement, string]) => void) => ColumnDefinition[],
    currentPortfolio: Portfolio,
    additionalHeaderPart?: JSX.Element
}

export default function Table({ columns, currentPortfolio, additionalHeaderPart }: TableProps) {
    const dispatch = useAppDispatch();
    const tableRef = useRef<TabulatorRef>(null);

    const [currentInvalidCell, setCurrentInvalidCell] = useState<[HTMLDivElement, string]>();
    const [quantityPopupData, setQuantityPopupData] = useState<[HTMLDivElement, number]>();
    const [tickerNamePopupData, setTickerNamePopupData] = useState<[HTMLDivElement, string]>();

    const resetInvalidCell = useCallback(() => setCurrentInvalidCell(undefined), []);

    const cellUpdated = useCallback((cell: CellComponent) => {
        dispatch(update({
            id: cell.getRow().getData().id,
            valueKey: $enum(EditableTableColumns)
                .asValueOrThrow(cell.getField()),
            newValue: cell.getValue() as string
        }));
        if (cell.getField() === BaseColumnNames.TICKER) {
            dispatch(getMoexQuotesForName(cell.getValue() as string));
        }
        resetInvalidCell();
    }, [dispatch, resetInvalidCell]);

    const rowMoved = useCallback((row: RowComponent) => {
        const newOrder = row.getTable().getRows().map((_row: RowComponent) => _row.getData().id);
        dispatch(update({
            id: row.getData().id,
            valueKey: EditableTableColumns.GROUP_NAME,
            newValue: row.getData().groupName,
            newOrder
        }));
    }, [dispatch]);

    const addRowToGroup = useCallback((groupName) => {
        dispatch(addNewPosition(groupName));
    }, [dispatch]);

    const updateGroup = useCallback((oldGroupName, newGroupName) => {
        dispatch(updateGroupName({
            oldGroupName,
            newGroupName
        }));
    }, [dispatch]);

    const deleteRow = useCallback((id: string) => {
        dispatch(deleteRowById(id));
    }, [dispatch]);

    const onCellMouseEnter = useCallback((event: MouseEvent, cell: CellComponent) => {
        if (cell.getRow()._row.type !== "calc") {
            const data = cell.getData();
            if (cell.getField() === ModelPortfolioColumnNames.QUANTITY && "targetQuantity" in data &&
                data.targetQuantity > data.quantity
            ) {
                setQuantityPopupData([cell.getElement() as HTMLDivElement, data.targetQuantity - data.quantity]);
            }

            const tickerName = cell.getData().name;
            if (cell.getField() === BaseColumnNames.TICKER && tickerName) {
                setTickerNamePopupData([cell.getElement() as HTMLDivElement, tickerName]);
            }
        }
    }, []);

    const onCellMouseLeave = useCallback(() => {
        setQuantityPopupData(undefined);
        setTickerNamePopupData(undefined);
    }, []);

    const options: TabulatorOptions = useMemo(() => ({
        movableRows: true,
        headerSortTristate: true,
        layoutColumnsOnNewData: true,
        groupBy: "groupName",
        columnCalcs: ColumnCalcsPosition.BOTH,
        reactiveData: true,
        layout: TableLayout.FIT_COLUMNS,
        resizableColumns: false,
        groupHeader: (value: DataTypes, count: number, data: TableData, group: GroupComponent) => {
            const elem = document.createElement("div");
            elem.className = styles.groupContainer;
            const input = document.createElement("input");
            input.value = group.getKey();
            input.className = styles.groupInput;
            input.addEventListener("blur", (ev) => {
                updateGroup(group.getKey(), (ev.target as HTMLInputElement).value);
            });
            elem.append(input);
            const plus = document.createElement("i");
            plus.className = `plus icon ${styles.groupAddButton}`;
            plus.addEventListener("click", () => addRowToGroup(group.getKey()));
            elem.append(plus);
            return elem;
        },
        cellMouseEnter: onCellMouseEnter,
        cellMouseLeave: onCellMouseLeave
    }), [addRowToGroup, onCellMouseEnter, onCellMouseLeave, updateGroup]);

    const actionBlock = useCallback(() => (
        <ActionBlock deleteRow={deleteRow} />
    ), [deleteRow]);

    const importTableToCsvText = useCallback(() => {
        if (tableRef.current) {
            const downloadConfig: TabulatorTableDownloadConfig = {
                columnHeaders: true,
                columnGroups: true,
                rowGroups: true,
                columnCalcs: false,
                dataTree: true
            };
            let list = tableRef.current.table.modules.export.generateExportList(downloadConfig, false, RowRange.VISIBLE, "download");
            list = generateExportList(list);
            return generateCsv(list);
        }
        return undefined;
    }, [tableRef]);

    const table = useMemo(() => (
        <ReactTabulator
            ref={tableRef} columns={columns(actionBlock(), setCurrentInvalidCell)} data={_.cloneDeep(currentPortfolio.positions)}
            options={options} className={styles.table} cellEdited={cellUpdated} rowMoved={rowMoved}
            cellEditCancelled={resetInvalidCell}
        />
    ), [columns, actionBlock, currentPortfolio.positions, options, cellUpdated, rowMoved, resetInvalidCell]);

    return (
        <div className={styles.container}>
            <AdditionalHeader
                additionalHeaderPart={additionalHeaderPart} importTableToCsvText={importTableToCsvText}
                currentPortfolio={currentPortfolio}
            />
            {table}
            {currentInvalidCell && (
                <Popup
                    open
                    context={currentInvalidCell[0]}
                    content={currentInvalidCell[1]}
                    position="top center"
                />
            )}
            {quantityPopupData && (
                <Popup
                    open
                    context={quantityPopupData[0]}
                    content={quantityPopupData[1]}
                    position="top center"
                />
            )}
            {tickerNamePopupData && (
                <Popup
                    open
                    context={tickerNamePopupData[0]}
                    content={tickerNamePopupData[1]}
                    position="top center"
                />
            )}
        </div>
    );
}
