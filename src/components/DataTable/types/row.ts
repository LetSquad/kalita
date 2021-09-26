import { DataTableData } from "./base";

export interface DataTableBaseRowParams {
    row: DataTableData;
}

export interface DataTableGroupRowParams {
    groupName: string;
    expandState: boolean;
    setExpandState: (newState: boolean) => void;
}
