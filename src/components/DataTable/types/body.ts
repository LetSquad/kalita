import { DataTableData } from "./base";

export interface DataTableBodyParams {
    groupBy?: keyof DataTableData;
    expandableGroup?: boolean;
    onGroupNameEdit?: (oldGroupName: string, newGroupName: string) => void;
    onAddRowToGroup?: (groupName: string) => void;
}

export interface DataTableGroupedBodyParams extends DataTableBodyParams {
    groupBy: keyof DataTableData;
}
