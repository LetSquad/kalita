import {
    KeyboardEvent, FocusEvent, ChangeEvent, MouseEvent, SyntheticEvent
} from "react";
// eslint-disable-next-line import/no-cycle
import { ColumnDefinition } from "./column";

export type DataTableData = {
    id: string;
} & Record<string, string | number | boolean | undefined>;

export interface UserDataTableClasses {
    tableClassName?: string;
    rowClassName?: string;
    rowCellClassName?: string;
    groupRowClassName?: string;
    groupRowCellClassName?: string;
    calcRowClassName?: string;
    calcRowCellClassName?: string;
    headerClassName?: string;
    headerRowClassName?: string;
    headerRowCellClassName?: string;
    footerClassName?: string;
    footerRowClassName?: string;
    footerRowCellClassName?: string;
}

export interface DataTableRef {
    exportToCsv: (options?: ExportToCsvOptions) => string | undefined;
}

export interface DataTable {
    data: DataTableData[];
    columns: ColumnDefinition[];
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
        value: string | number | boolean | undefined
    ) => void;
    onCellBlur?: (
        rowId: string,
        field: keyof DataTableData,
        event: FocusEvent<HTMLInputElement>,
        value: string | number | boolean | undefined
    ) => void;
    onCellKeyEnter?: (
        rowId: string,
        field: keyof DataTableData,
        event: KeyboardEvent<HTMLInputElement>,
        value: string | number | boolean | undefined
    ) => void;
    classes?: UserDataTableClasses;
}

export interface ExportToCsvOptions {
    includeGroup?: boolean;
    includeEmptyTitle?: boolean;
}
