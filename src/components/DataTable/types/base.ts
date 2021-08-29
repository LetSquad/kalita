import { KeyboardEvent, FocusEvent, ChangeEvent, MouseEvent, SyntheticEvent } from "react";

export type DataTableData = {
    id: string;
    [key: string]: string | number | undefined;
};

export interface DataTable {
    data: DataTableData[];
    emptyTablePlaceholder?: string;
    groupBy?: keyof DataTableData;
    expandableGroup?: boolean;
    onGroupNameEdit?: (oldGroupName: string, newGroupName: string) => void;
    onAddRowToGroup?: (groupName: string) => void;
    onRowMoved?: (rowId: string, oldOrder: number, newOrder: number, newGroupName?: string) => void;
    onCellChanged?: (
        rowId: string,
        field: keyof DataTableData,
        event: KeyboardEvent<HTMLInputElement> |
        ChangeEvent<HTMLInputElement> |
        MouseEvent<HTMLElement> |
        SyntheticEvent<HTMLElement>,
        value: string
    ) => void;
    onCellBlur?: (
        rowId: string,
        field: keyof DataTableData,
        event: FocusEvent<HTMLInputElement>,
        value: string
    ) => void
}

