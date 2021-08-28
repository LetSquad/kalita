import { CSSProperties } from "react";
import { DataTableData } from "./base";
import { ColumnDefinition } from "./column";
import { ElementFormatterParams, LinkFormatterParams, MoneyFormatterParams, PercentageFormatterParams } from "./formatter";

export interface DataTableHeaderCellParams {
    column: ColumnDefinition;
}

export interface DataTableCellParams {
    id: string;
    column: ColumnDefinition;
    row: DataTableData;
    cell: string | number | undefined;
}

export interface DataTableBaseCellParams {
    children?: string | number | JSX.Element | JSX.Element[] | undefined;
    style?: CSSProperties;
    className?: string;
}

export interface DataTableFormatterCellParams {
    cell: string | number | undefined;
    column: Required<Pick<ColumnDefinition, "formatter">>;
}

export interface DataTableElementFormatterCellParams {
    params: ElementFormatterParams;
}

export interface DataTableMoneyFormatterCellParams {
    params?: MoneyFormatterParams;
}

export interface DataTablePercentageFormatterCellParams {
    params?: PercentageFormatterParams;
}

export interface DataTableLinkFormatterCellParams {
    params?: LinkFormatterParams;
}
