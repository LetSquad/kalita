import { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent, SyntheticEvent } from "react";
import { DropResult, ResponderProvided } from "react-beautiful-dnd";
import { DataTableData } from "./base";

export interface DataTableBodyParams {
    groupBy?: keyof DataTableData;
    expandableGroup?: boolean;
    onGroupNameEdit?: (oldGroupName: string, newGroupName: string) => void;
    onAddRowToGroup?: (groupName: string) => void;
    onDragEnd: (result: DropResult, provided: ResponderProvided) => void;
    isRowMovedEnabled: boolean;
    onCellChanged?: (
        rowId: string,
        field: keyof DataTableData,
        event: KeyboardEvent<HTMLInputElement> |
        FocusEvent<HTMLInputElement> |
        ChangeEvent<HTMLInputElement> |
        MouseEvent<HTMLElement> |
        SyntheticEvent<HTMLElement>,
        value: string
    ) => void,
    onCellBlur?: (
        rowId: string,
        field: keyof DataTableData,
        event: FocusEvent<HTMLInputElement>,
        value: string
    ) => void
}

export interface DataTableGroupedBodyParams extends DataTableBodyParams {
    groupBy: keyof DataTableData;
    onDragEnd: (result: DropResult, provided: ResponderProvided) => void;
}
