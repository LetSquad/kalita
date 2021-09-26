import { DataTableData } from "./base";

export interface GroupData {
    name: string;
    data: DataTableData[];
}

export interface DataTableGroupParams {
    group: GroupData;
}
