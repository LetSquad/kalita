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


