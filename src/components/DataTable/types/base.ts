export type DataTableData = {
    id: string;
    [key: string]: string | number | undefined;
};

export interface DataTable {
    data: DataTableData[];
    groupBy?: keyof DataTableData;
    expandableGroup?: boolean;
    onGroupNameEdit?: (oldGroupName: string, newGroupName: string) => void;
    onAddRowToGroup?: (groupName: string) => void;
}

export interface ColumnDefinition {
    field: string;
    title?: string;
    element?: (rowData: DataTableData) => JSX.Element;
}
