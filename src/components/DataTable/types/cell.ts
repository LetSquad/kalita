import { ColumnDefinition, DataTableData } from "./base";

export interface DataTableHeaderCellParams {
    column: ColumnDefinition;
}

export interface DataTableCellParams {
    column: ColumnDefinition;
    row: DataTableData;
}

export interface DataTableBaseCellParams {
    row: DataTableData;
    column: Pick<ColumnDefinition, "field">;
}

export interface DataTableElementCellParams {
    row: DataTableData;
    column: Required<Pick<ColumnDefinition, "element">>;
}
