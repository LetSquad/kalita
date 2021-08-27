import { DropResult, ResponderProvided } from "react-beautiful-dnd";
import { DataTableData } from "./base";

export interface DataTableBodyParams {
    groupBy?: keyof DataTableData;
    expandableGroup?: boolean;
    onGroupNameEdit?: (oldGroupName: string, newGroupName: string) => void;
    onAddRowToGroup?: (groupName: string) => void;
    onDragEnd: (result: DropResult, provided: ResponderProvided) => void;
    isRowMovedEnabled: boolean;
}

export interface DataTableGroupedBodyParams extends DataTableBodyParams {
    groupBy: keyof DataTableData;
}
