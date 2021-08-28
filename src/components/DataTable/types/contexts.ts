import { CSSProperties } from "react";
import { DataTableData } from "./base";
import { ColumnDefinition } from "./column";

export interface DataTableContextParams {
    columns: ColumnDefinition[];
    data: DataTableData[];
}

export interface DataTableBaseCellContextParams {
    column: ColumnDefinition;
}

export interface DataTableElementFormatterCellContextParams {
    id: string;
    cell: string | number | undefined;
    row: DataTableData;
}

export interface DataTableMoneyFormatterCellContextParams {
    cell: number;
}

export interface DataTablePercentageFormatterCellContextParams {
    cell: number;
}

export interface DataTableLinkFormatterCellContextParams {
    cell: number | string;
}

export interface DataTableColorFormatterCellContextParams {
    cell: string;
    style?: CSSProperties;
}
