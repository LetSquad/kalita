import { CSSProperties } from "react";
import { DataTableData } from "./base";
import { CalcType } from "./calc";
import { ColumnDefinition, FormatterColumnDefinition } from "./column";
import { MoneyFormatter, PercentageFormatter, ProgressCalcFormatter, StarFormatter } from "./formatter";

export interface DataTableHeaderCellParams {
    column: ColumnDefinition;
}

export interface DataTableCellParams {
    id: string;
    field: keyof DataTableData;
    column: ColumnDefinition;
    row?: DataTableData;
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

export interface DataTableCalcCellParams {
    calcType: CalcType;
    field: keyof DataTableData;
    column: ColumnDefinition;
    cell: string | number | boolean | undefined;
    columnData: (string | number | boolean | undefined)[];
}

export interface DataTableBaseCalcCellParams {
    column: ColumnDefinition;
}

export interface DataTableCalcFormatterCellParams<
    K = string | number | boolean | undefined,
    V = MoneyFormatter | PercentageFormatter | StarFormatter | ProgressCalcFormatter
> {
    cell: K;
    formatter: V;
    columnData: K[];
}
