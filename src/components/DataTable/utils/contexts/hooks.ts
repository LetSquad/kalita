import { useContext } from "react";
import { DataTableBodyParams, DataTableGroupedBodyParams } from "../../types/body";
import { DataTableBaseCellParams, DataTableCellParams, DataTableElementCellParams } from "../../types/cell";
import { DataTableContextParams } from "../../types/contexts";
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
    return useContext(DataTableCellContext) as DataTableBaseCellParams;
}

export function useDataTableElementCellContext() {
    return useContext(DataTableCellContext) as DataTableElementCellParams;
}
