import { CSSProperties } from "react";
import { ColumnDefinition, DataTableData } from "./base";

export interface DataTableHeaderCellParams {
    column: ColumnDefinition;
    style?: CSSProperties;
}

export interface DataTableCellParams {
    column: ColumnDefinition;
    row: DataTableData;
    style?: CSSProperties;
}

export interface DataTableBaseCellParams {
    row: DataTableData;
    column: Pick<ColumnDefinition, "field">;
    style?: CSSProperties;
}

export interface DataTableElementCellParams {
    row: DataTableData;
    column: Required<Pick<ColumnDefinition, "element">>;
    style?: CSSProperties;
}

export interface DataTableEmptyCellParams {
    style?: CSSProperties;
}
