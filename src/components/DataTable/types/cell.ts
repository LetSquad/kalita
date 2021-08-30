import { CSSProperties } from "react";
import { DataTableData } from "./base";
import { ColumnDefinition, FormatterColumnDefinition } from "./column";

export interface DataTableHeaderCellParams {
    column: ColumnDefinition;
}

export interface DataTableCellParams {
    id: string;
    field: keyof DataTableData;
    column: ColumnDefinition;
    row: DataTableData;
    cell: string | number | boolean | undefined;
}

export interface DataTableBaseCellParams {
    children?: string | number | boolean | JSX.Element | JSX.Element[] | undefined;
    style?: CSSProperties;
    className?: string;
    withWrapper?: boolean;
}

export interface DataTableFormatterCellParams {
    cell: string | number | boolean | undefined;
    column: Required<Pick<FormatterColumnDefinition, "formatter">>;
}
