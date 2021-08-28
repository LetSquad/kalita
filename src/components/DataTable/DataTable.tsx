import React, { useCallback } from "react";
import { DropResult } from "react-beautiful-dnd";
import { Table } from "semantic-ui-react";
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
        width: 130
    }, {
        title: "Вес",
        field: ModelPortfolioColumnNames.WEIGHT,
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
        }
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
        }
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
        }
    }, {
        title: "Целевое количество",
        field: ModelPortfolioColumnNames.TARGET_QUANTITY,
        width: 190
    }, {
        title: "В портфеле",
        field: ModelPortfolioColumnNames.QUANTITY,
        width: 130
    }, {
        title: "Сумма",
        field: BaseColumnNames.AMOUNT,
        width: 130
    }, {
        field: BaseColumnNames.ACTION,
        formatter: {
            type: FormatterTypes.ELEMENT,
            params: {
                renderElement: (cellData, rowId) => <NewActionBlock rowId={rowId} />
            }
        },
        width: 40
    }
];

export default function DataTable({
    data,
    groupBy,
    onGroupNameEdit,
    onAddRowToGroup,
    onRowMoved,
    expandableGroup
}: DataTableType) {
    const onDragEnd = useCallback((result: DropResult) => {
        if (onRowMoved && result.destination) {
            onRowMoved(result.draggableId, result.source.index, result.destination.index, result.destination.droppableId);
        }
    }, [onRowMoved]);

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
            </div>
        </DataTableContext.Provider>
    );
}
