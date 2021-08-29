import { CSSProperties } from "react";
import { DataTableData } from "./base";
import {
    BaseFormatterColumnDefinition,
    ColumnDefinition,
    EditFormattersColumnDefinition,
    ElementFormatterColumnDefinition,
    NotEditFormattersColumnDefinition
} from "./column";

export interface DataTableContextParams {
    columns: ColumnDefinition[];
    data: DataTableData[];
}

export interface DataTableBaseCellContextParams {
    id: string;
    field: keyof DataTableData;
    cell: string | number | boolean | undefined;
    row: DataTableData;
    column: ColumnDefinition;
}

export interface DataTableNotEditCellFormatterContextParams<T, K extends NotEditFormattersColumnDefinition> {
    id: string;
    cell: T;
    row: DataTableData;
    column: Required<Pick<K, "formatter">>
}

export interface DataTableEditCellContextParams<T> {
    cell: T;
    column: Pick<BaseFormatterColumnDefinition, "edit">
}

export interface DataTableEditCellFormatterContextParams<T, K extends EditFormattersColumnDefinition> {
    id: string;
    cell: T;
    row: DataTableData;
    column: Required<Pick<K, "formatter">> & Pick<K, "edit">;
}

export interface DataTableElementCellFormatterContextParams<T> {
    id: string;
    cell: T;
    row: DataTableData;
    column: Required<Pick<ElementFormatterColumnDefinition, "formatter">>;
}

export interface DataTableColorCellFormatterContextParams {
    cell: string;
    style?: CSSProperties;
}

export interface DataTableEditContextParams<T> {
    id: string;
    cell: T;
    column: Required<Pick<BaseFormatterColumnDefinition, "field">>
}


