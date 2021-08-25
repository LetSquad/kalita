import React from "react";
import { Table } from "semantic-ui-react";
import { BaseColumnNames, ModelPortfolioColumnNames } from "../../models/table/enums";
import DataTableBody from "./Body/DataTableBody";
import DataTableHeader from "./Header/DataTableHeader";
import styles from "./styles/DataTable.scss";
import { DataTable as DataTableType } from "./types/base";
import { DataTableBodyContext, DataTableContext } from "./utils/contexts/contexts";

const columns = [
    {
        title: "Инструмент",
        field: BaseColumnNames.TICKER
    }, {
        title: "Вес",
        field: ModelPortfolioColumnNames.WEIGHT
    }, {
        title: "Доля",
        field: BaseColumnNames.PERCENTAGE
    }, {
        title: "Целевая сумма",
        field: ModelPortfolioColumnNames.TARGET_AMOUNT
    }, {
        title: "Цена",
        field: BaseColumnNames.CURRENT_PRICE
    }, {
        title: "Целевое количество",
        field: ModelPortfolioColumnNames.TARGET_QUANTITY
    }, {
        title: "В портфеле",
        field: ModelPortfolioColumnNames.QUANTITY
    }, {
        title: "Сумма",
        field: BaseColumnNames.AMOUNT
    }
];

export default function DataTable({
    data,
    groupBy,
    onGroupNameEdit,
    onAddRowToGroup,
    expandableGroup
}: DataTableType) {
    return (
        <DataTableContext.Provider
            value={{
                columns,
                data
            }}
        >
            <Table className={styles.table}>
                <DataTableHeader />
                <DataTableBodyContext.Provider
                    value={{
                        groupBy,
                        onAddRowToGroup,
                        onGroupNameEdit,
                        expandableGroup
                    }}
                >
                    <DataTableBody />
                </DataTableBodyContext.Provider>
            </Table>
        </DataTableContext.Provider>
    );
}
