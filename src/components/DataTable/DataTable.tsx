import React, { useCallback, useMemo } from "react";
import { DropResult } from "react-beautiful-dnd";
import { Table } from "semantic-ui-react";
import { VerticalAlignValues } from "../../../custom_typings/react-tabulator/enums";
import { BaseColumnNames, ModelPortfolioColumnNames } from "../../models/table/enums";
import { NewActionBlock } from "../BrokeragePortfolioTable/NewActionBlock";
import DataTableBody from "./Body/DataTableBody";
import DataTableHeader from "./Header/DataTableHeader";
import styles from "./styles/DataTable.scss";
import { DataTable as DataTableType } from "./types/base";
import { ColumnDefinition } from "./types/column";
import { FormatterTypes } from "./types/formatter";
import { DataTableBodyContext, DataTableContext } from "./utils/contexts/contexts";

const columns: ColumnDefinition[] = [
    {
        title: "Инструмент",
        field: BaseColumnNames.TICKER,
        width: 130,
        vertAlign: VerticalAlignValues.MIDDLE
    }, {
        title: "Вес",
        field: ModelPortfolioColumnNames.WEIGHT,
        vertAlign: VerticalAlignValues.MIDDLE,
        width: 80
    }, {
        title: "Доля",
        field: BaseColumnNames.PERCENTAGE,
        width: 85,
        formatter: {
            type: FormatterTypes.PERCENTAGE,
            params: {
                additionalSpace: true
            }
        },
        vertAlign: VerticalAlignValues.MIDDLE
    }, {
        title: "Целевая сумма",
        field: ModelPortfolioColumnNames.TARGET_AMOUNT,
        width: 165,
        formatter: {
            type: FormatterTypes.MONEY,
            params: {
                currency: "₽",
                additionalSpace: true
            }
        },
        vertAlign: VerticalAlignValues.MIDDLE
    }, {
        title: "Цена",
        field: BaseColumnNames.CURRENT_PRICE,
        width: 120,
        formatter: {
            type: FormatterTypes.MONEY,
            params: {
                currency: "₽",
                additionalSpace: true
            }
        },
        vertAlign: VerticalAlignValues.MIDDLE
    }, {
        title: "Целевое количество",
        field: ModelPortfolioColumnNames.TARGET_QUANTITY,
        width: 190,
        vertAlign: VerticalAlignValues.MIDDLE
    }, {
        title: "В портфеле",
        field: ModelPortfolioColumnNames.QUANTITY,
        width: 130,
        vertAlign: VerticalAlignValues.MIDDLE
    }, {
        title: "Сумма",
        field: BaseColumnNames.AMOUNT,
        width: 130,
        vertAlign: VerticalAlignValues.MIDDLE
    }, {
        field: BaseColumnNames.ACTION,
        formatter: {
            type: FormatterTypes.ELEMENT,
            params: {
                renderElement: (cellData, rowId) => <NewActionBlock rowId={rowId} />
            }
        },
        width: 40,
        vertAlign: VerticalAlignValues.MIDDLE
    }
];

export default function DataTable({
    data,
    groupBy,
    onGroupNameEdit,
    onAddRowToGroup,
    onRowMoved,
    expandableGroup,
    emptyTablePlaceholder
}: DataTableType) {
    const onDragEnd = useCallback((result: DropResult) => {
        if (onRowMoved && result.destination) {
            onRowMoved(result.draggableId, result.source.index, result.destination.index, result.destination.droppableId);
        }
    }, [onRowMoved]);

    const content = useMemo(() => data.length > 0
        ? (
            <Table className={styles.innerTableBody}>
                <DataTableBodyContext.Provider
                    value={{
                        groupBy,
                        onAddRowToGroup,
                        onGroupNameEdit,
                        expandableGroup,
                        onDragEnd,
                        isRowMovedEnabled: !!onRowMoved
                    }}
                >
                    <DataTableBody />
                </DataTableBodyContext.Provider>
            </Table>
        )
        : <div className={styles.innerTablePlaceholder}>{emptyTablePlaceholder ?? "Данные недоступны"}</div>,
    [data.length, emptyTablePlaceholder, expandableGroup, groupBy, onAddRowToGroup, onDragEnd, onGroupNameEdit, onRowMoved]);

    return (
        <DataTableContext.Provider
            value={{
                columns,
                data
            }}
        >
            <div className={styles.tableContainer}>
                <Table className={styles.innerTableHeader}>
                    <DataTableHeader />
                </Table>
                {content}
            </div>
        </DataTableContext.Provider>
    );
}
