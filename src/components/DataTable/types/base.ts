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
}

