import { CSSProperties } from "react";
import { DataTableData } from "./base";
import { ColumnDefinition } from "./column";

export interface DataTableContextParams {
    columns: ColumnDefinition[];
    data: DataTableData[];
}

export interface DataTableBaseCellContextParams {
    style?: CSSProperties;
}

export interface DataTableElementFormatterCellContextParams {
    id: string;
    cell: string | number | undefined;
    row: DataTableData;
}
