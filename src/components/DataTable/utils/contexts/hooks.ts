import { useContext } from "react";
import { DataTableBodyParams, DataTableGroupedBodyParams } from "../../types/body";
import { DataTableCellParams, DataTableFormatterCellParams } from "../../types/cell";
import {
    ImageFormatterColumnDefinition,
    LinkFormatterColumnDefinition,
    MoneyFormatterColumnDefinition,
    PercentageFormatterColumnDefinition, ProgressFormatterColumnDefinition, StarFormatterColumnDefinition
} from "../../types/column";
import {
    DataTableBaseCellContextParams,
    DataTableColorCellFormatterContextParams,
    DataTableContextParams,
    DataTableEditCellContextParams,
    DataTableEditCellFormatterContextParams, DataTableEditContextParams,
    DataTableElementCellFormatterContextParams, DataTableNotEditCellFormatterContextParams
} from "../../types/contexts";
import { DataTableBodyContext, DataTableCellContext, DataTableContext } from "./contexts";

export function useDataTableContext() {
    return useContext(DataTableContext) as DataTableContextParams;
}

export function useDataTableBodyContext() {
    return useContext(DataTableBodyContext) as DataTableBodyParams;
}

export function useDataTableBodyGroupedContext() {
    return useContext(DataTableBodyContext) as DataTableGroupedBodyParams;
}

export function useDataTableCellContext() {
    return useContext(DataTableCellContext) as DataTableCellParams;
}

export function useDataTableBaseCellContext() {
    return useContext(DataTableCellContext) as DataTableBaseCellContextParams;
}

export function useDataTableFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableFormatterCellParams;
}

export function useDataTableBaseFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableEditCellContextParams<string | number | undefined>;
}

export function useDataTableElementFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableElementCellFormatterContextParams<string | number | undefined>;
}

export function useDataTableMoneyFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableEditCellFormatterContextParams<number, MoneyFormatterColumnDefinition>;
}

export function useDataTablePercentageFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableEditCellFormatterContextParams<number, PercentageFormatterColumnDefinition>;
}

export function useDataTableLinkFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableNotEditCellFormatterContextParams<
    string | number,
    LinkFormatterColumnDefinition
    >;
}

export function useDataTableColorFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableColorCellFormatterContextParams;
}

export function useDataTableImageFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableNotEditCellFormatterContextParams<
    string | number,
    ImageFormatterColumnDefinition
    >;
}

export function useDataTableStarFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableEditCellFormatterContextParams<number, StarFormatterColumnDefinition>;
}

export function useDataTableProgressFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableNotEditCellFormatterContextParams<number, ProgressFormatterColumnDefinition>;
}

export function useDataTableEditContext() {
    return useContext(DataTableCellContext) as DataTableEditContextParams<number | string | undefined>;
}
