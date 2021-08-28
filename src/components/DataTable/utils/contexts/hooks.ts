import { useContext } from "react";
import { DataTableBodyParams, DataTableGroupedBodyParams } from "../../types/body";
import { DataTableCellParams, DataTableFormatterCellParams } from "../../types/cell";
import {
    DataTableBaseCellContextParams,
    DataTableContextParams,
    DataTableElementFormatterCellContextParams,
    DataTableMoneyFormatterCellContextParams,
    DataTablePercentageFormatterCellContextParams
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

export function useDataTableElementFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableElementFormatterCellContextParams;
}

export function useDataTableMoneyFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTableMoneyFormatterCellContextParams;
}

export function useDataTablePercentageFormatterCellContext() {
    return useContext(DataTableCellContext) as DataTablePercentageFormatterCellContextParams;
}
