import { DataTableData } from "./base";

export interface GroupData {
    name: string;
    data: DataTableData[];
}

export interface DataTableBodyParams {
    groupBy?: keyof DataTableData;
    expandableGroup?: boolean;
    onGroupNameEdit?: (oldGroupName: string, newGroupName: string) => void;
    onAddRowToGroup?: (groupName: string) => void;
}

export type DataTableUngroupedBodyParams = Omit<DataTableBodyParams,
"groupBy" |
"onGroupNameEdit" |
"onAddRowToGroup" |
"expandableGroup"
>;

export interface DataTableGroupedBodyParams extends DataTableBodyParams {
    groupBy: keyof DataTableData;
}

export interface DataTableGroupParams {
    group: GroupData;
}
