import { useContext } from "react";
import { DataTableBodyParams, DataTableGroupedBodyParams, DataTableUngroupedBodyParams } from "../../types/body";
import { DataTableContext as DataTableContextType } from "../../types/contexts";
import { DataTableBodyContext, DataTableContext } from "./contexts";

export function useDataTableContext() {
    return useContext(DataTableContext) as DataTableContextType;
}

export function useDataTableBodyContext() {
    return useContext(DataTableBodyContext) as DataTableBodyParams;
}

export function useDataTableBodyGroupedContext() {
    return useContext(DataTableBodyContext) as DataTableGroupedBodyParams;
}

export function useDataTableBodyUngroupedContext() {
    return useContext(DataTableBodyContext) as DataTableUngroupedBodyParams;
}
